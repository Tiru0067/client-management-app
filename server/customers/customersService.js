const db = require("../utils/db");
const util = require("util");
const {
  getPagination,
  buildSearchFilter,
  validateSort,
} = require("./customersHelpers");
const { lastAffectedId, changesCount } = require("../utils/helpers");

const dbGet = util.promisify(db.get).bind(db);
const dbAll = util.promisify(db.all).bind(db);

// Fetch customers with optional search, sorting, and pagination
exports.getCustomers = async (queryOptions) => {
  try {
    const filters = buildSearchFilter(queryOptions.search);
    const sorting = validateSort(queryOptions.sort_by, queryOptions.sort_order);

    let whereClause = filters.whereClause;
    const trueValues = [true, "true", 1, "1"];
    const falseValues = [false, "false", 0, "0"];

    const value = trueValues.includes(queryOptions.only_one_address)
      ? 1
      : falseValues.includes(queryOptions.only_one_address)
      ? 0
      : null;

    if (value !== null)
      whereClause +=
        (whereClause ? " AND " : "WHERE ") +
        `customers.only_one_address = ${value}`;

    // 1. Get total distinct customer count
    const countsql = `
      SELECT COUNT(DISTINCT customers.id) as count FROM customers
      LEFT JOIN addresses ON customers.id = addresses.customer_id
      ${whereClause}
    `;
    const countResults = await dbGet(countsql, filters.params);
    const totalItems = countResults.count;

    // 2. Get pagination customer ids
    const idSql = `
      SELECT DISTINCT customers.id FROM customers
      LEFT JOIN addresses ON customers.id = addresses.customer_id
      ${whereClause}
      ORDER BY customers.${sorting.sortBy} ${sorting.sortOrder}
      LIMIT ? OFFSET ?
    `;

    const pagination = getPagination(
      totalItems,
      queryOptions.page,
      queryOptions.limit
    );
    const idParams = [...filters.params, pagination.limit, pagination.offset];

    // Get customer IDs for the current page
    const idRows = await dbAll(idSql, idParams);
    const customerIds = idRows.map((row) => row.id);

    if (customerIds.length === 0) {
      return {
        customers: [],
        currentPage: pagination.currentPage,
        totalPages: pagination.totalPages,
        totalItems,
        pageLimit: pagination.limit,
      };
    }

    // 3. Get customer details with addresses
    const sql = `
        SELECT 
          customers.id AS c_id,
          customers.first_name AS c_first_name,
          customers.last_name AS c_last_name,
          customers.email AS c_email,
          customers.created_at AS c_created_at,
          customers.updated_at AS c_updated_at,
          customers.phone_number AS c_phone_number,
          customers.only_one_address AS c_only_one_address,
          addresses.id AS a_id,
          addresses.address_details AS a_address_details,
          addresses.city AS a_city,
          addresses.state AS a_state,
          addresses.pin_code AS a_pin_code
        FROM customers
        LEFT JOIN addresses ON customers.id = addresses.customer_id
        WHERE customers.id IN (${customerIds.map(() => "?").join(",")})
        ORDER BY customers.${sorting.sortBy} ${sorting.sortOrder}
    `;

    const rows = await dbAll(sql, customerIds);

    const customersMap = new Map();

    rows.forEach((row) => {
      // Separate customer and address fields
      const customerData = {};
      const addressData = {};

      for (const key in row) {
        if (key.startsWith("c_")) {
          customerData[key.replace("c_", "")] = row[key];
        } else if (key.startsWith("a_")) {
          addressData[key.replace("a_", "")] = row[key];
        }
      }

      if (!customersMap.has(customerData.id)) {
        customersMap.set(customerData.id, { ...customerData, addresses: [] });
      }

      if (addressData.id) {
        customersMap.get(customerData.id).addresses.push(addressData);
      }
    });

    const customers = Array.from(customersMap.values());

    return {
      customers,
      currentPage: pagination.currentPage,
      totalPages: pagination.totalPages,
      totalItems,
      pageLimit: pagination.limit,
    };
  } catch (err) {
    throw err;
  }
};

// Add a new customer service
exports.addCustomer = async (customerData) => {
  try {
    // Defensive: do not allow these fields from input
    delete customerData.id;
    delete customerData.created_at;
    delete customerData.updated_at;
    delete customerData.only_one_address; // computed field

    const keys = Object.keys(customerData);
    if (keys.length === 0) {
      throw new Error("No valid fields provided to insert");
    }
    const placeholders = keys.map(() => "?").join(", ");
    const values = keys.map((k) => customerData[k]);

    const sql = `INSERT INTO customers 
    (${keys.join(", ")}) VALUES (${placeholders})`;
    const result = await lastAffectedId(sql, values);

    // Fetch and return the newly added customer
    const currentItemSql = `SELECT * FROM customers WHERE id = ?`;
    const currentItem = await dbGet(currentItemSql, [result]);
    return currentItem;
  } catch (err) {
    throw err;
  }
};

//  Get customer by ID service
exports.getCustomerById = async (id) => {
  try {
    const sql = `
      SELECT 
        customers.id AS c_id,
        customers.first_name AS c_first_name,
        customers.last_name AS c_last_name,
        customers.email AS c_email,
        customers.created_at AS c_created_at,
        customers.updated_at AS c_updated_at,
        customers.phone_number AS c_phone_number,
        customers.only_one_address AS c_only_one_address,
        addresses.id AS a_id,
        addresses.address_details AS a_address_details,
        addresses.city AS a_city,
        addresses.state AS a_state,
        addresses.pin_code AS a_pin_code
      FROM customers
      LEFT JOIN addresses ON customers.id = addresses.customer_id
      WHERE customers.id = ?
    `;

    const rows = await dbAll(sql, [id]);
    if (rows.length === 0) return null;

    // Separate customer and address fields dynamically
    const customerData = {};
    const addresses = [];

    rows.forEach((row) => {
      const addressData = {};

      for (const key in row) {
        if (key.startsWith("c_")) {
          customerData[key.replace("c_", "")] = row[key];
        } else if (key.startsWith("a_")) {
          addressData[key.replace("a_", "")] = row[key];
        }
      }

      if (addressData.id) {
        addresses.push(addressData);
      }
    });

    return {
      ...customerData,
      addresses,
    };
  } catch (err) {
    throw err;
  }
};

// Update customer by ID service
exports.updateCustomerById = async (id, updateFields) => {
  try {
    if (!updateFields || Object.keys(updateFields).length === 0) return null;

    const columns = Object.keys(updateFields);
    const placeholders = columns.map((key) => `${key} = ?`).join(", ");
    const params = columns.map((key) => updateFields[key]);
    params.push(id);

    const sql = `
      UPDATE customers
      SET ${placeholders}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const changes = await changesCount(sql, params);
    if (changes === 0) return null;

    const updatedCustomerSql = `SELECT * FROM customers WHERE id = ?`;
    return await dbGet(updatedCustomerSql, [id]);
  } catch (err) {
    throw err;
  }
};

// Delete customer by ID service
exports.deleteCustomerById = async (id) => {
  try {
    const sql = `DELETE FROM customers WHERE id = ?`;
    const changes = await changesCount(sql, [id]);
    return changes; // returns number of rows deleted
  } catch (err) {
    throw err;
  }
};
