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
exports.getCustomers = async (
  search,
  sortBy,
  sortOrder,
  page,
  limit,
  only_one_address
) => {
  try {
    const filters = buildSearchFilter(search);
    const sorting = validateSort(sortBy, sortOrder);

    let whereClause = filters.whereClause;
    const trueValues = [true, "true", 1, "1"];
    const falseValues = [false, "false", 0, "0"];

    const value = trueValues.includes(only_one_address)
      ? 1
      : falseValues.includes(only_one_address)
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

    const pagination = getPagination(totalItems, page, limit);
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
          customers.id,
          customers.first_name,
          customers.last_name,
          customers.phone_number,
          customers.only_one_address,
          addresses.address_details,
          addresses.city,
          addresses.state,
          addresses.pin_code
        FROM customers
        LEFT JOIN addresses ON customers.id = addresses.customer_id
        WHERE customers.id IN (${customerIds.map(() => "?").join(",")})
        ORDER BY customers.${sorting.sortBy} ${sorting.sortOrder}
    `;

    const rows = await dbAll(sql, customerIds);

    // Group addresses by customer
    const customersMap = new Map();
    rows.forEach((row) => {
      if (!customersMap.has(row.id)) {
        customersMap.set(row.id, {
          id: row.id,
          first_name: row.first_name,
          last_name: row.last_name,
          phone_number: row.phone_number,
          only_one_address: row.only_one_address,
          addresses: [],
        });
      }
      if (row.address_details) {
        customersMap.get(row.id).addresses.push({
          address_details: row.address_details,
          city: row.city,
          state: row.state,
          pin_code: row.pin_code,
        });
      }
    });

    // Convert map values to an array
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
exports.addCustomer = async (first_name, last_name, phone_number) => {
  try {
    const sql = `
    INSERT INTO customers (first_name, last_name, phone_number)
    VALUES (?, ?, ?)
    `;
    const result = await lastAffectedId(sql, [
      first_name,
      last_name,
      phone_number,
    ]);

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
        customers.id,
        customers.first_name,
        customers.last_name,
        customers.phone_number,
        customers.only_one_address,
        addresses.address_details,
        addresses.city,
        addresses.state,
        addresses.pin_code
      FROM customers
      LEFT JOIN addresses ON customers.id = addresses.customer_id
      WHERE customers.id = ?
    `;
    const rows = await dbAll(sql, [id]);
    if (rows.length === 0) return null; // Customer not found

    const customer = {
      id: rows[0].id,
      first_name: rows[0].first_name,
      last_name: rows[0].last_name,
      phone_number: rows[0].phone_number,
      only_one_address: rows[0].only_one_address,
      addresses: [],
    };

    rows.forEach((row) => {
      if (row.address_details) {
        customer.addresses.push({
          address_details: row.address_details,
          city: row.city,
          state: row.state,
          pin_code: row.pin_code,
        });
      }
    });

    return customer;
  } catch (err) {
    throw err;
  }
};

// Update customer by ID service
exports.updateCustomerById = async (id, updateFields) => {
  try {
    const existingCustomer = await dbGet(
      `SELECT * FROM customers WHERE id = ?`,
      [id]
    );
    if (!existingCustomer) return null; // Customer not found

    // Filter out id
    const newUpdateFields = { ...existingCustomer, ...updateFields };
    const columns = Object.keys(newUpdateFields).filter((key) => key !== "id");
    const placeholders = columns.map((key) => `${key} = ?`).join(", ");
    const params = columns.map((key) => newUpdateFields[key]);
    params.push(id);

    const sql = `
      UPDATE customers
      SET ${placeholders}
      WHERE id = ?
    `;

    // Execute the update query and get the number of affected rows
    const changes = await changesCount(sql, params);

    if (changes === 0) return null; // No rows updated, possibly invalid ID

    // Fetch and return the updated customer
    const updatedCustomerSql = `SELECT * FROM customers WHERE id = ?`;
    const updatedCustomer = await dbGet(updatedCustomerSql, [id]);
    return updatedCustomer;
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
