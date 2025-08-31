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
const dbRun = util.promisify(db.run).bind(db);

// Fetch customers with optional search, sorting, and pagination
exports.getCustomers = async (search, sortBy, sortOrder, page, limit) => {
  try {
    const filters = buildSearchFilter(search);
    const sorting = validateSort(sortBy, sortOrder);

    const countsql = `SELECT COUNT(*) as count FROM customers ${filters.whereClause}`;
    const sql = `
        SELECT * FROM customers ${filters.whereClause}
        ORDER BY ${sorting.sortBy} ${sorting.sortOrder}
        LIMIT ? OFFSET ?
    `;

    // First, get the total count of items for pagination
    const countResults = await dbGet(countsql, filters.params);
    const totalItems = countResults.count;
    const pagination = getPagination(totalItems, page, limit);
    const params = [...filters.params, pagination.limit, pagination.offset];

    const rows = await dbAll(sql, params);

    return {
      rows,
      currentPage: pagination.currentPage,
      totalPages: pagination.totalPages,
      totalItems,
      pageLimit: pagination.limit,
    };
  } catch (err) {
    throw err;
  }
};

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

exports.getCustomerById = async (id) => {
  try {
    const sql = `SELECT * FROM customers WHERE id = ?`;
    const customer = await dbGet(sql, [id]);
    return customer;
  } catch (err) {
    throw err;
  }
};

exports.deleteCustomerById = async (id) => {
  try {
    const sql = `DELETE FROM customers WHERE id = ?`;
    const changes = await changesCount(sql, [id]);
    return changes; // returns number of rows deleted
  } catch (err) {
    throw err;
  }
};
