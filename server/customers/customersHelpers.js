const db = require("../utils/db");
const util = require("util");

const dbGet = util.promisify(db.get).bind(db);
const dbRun = util.promisify(db.run).bind(db);

// helpers for building SQL queries with search, pagination, and sorting
// ##################################################################################

// Allowed fields for sorting
const allowedSortFields = ["id", "first_name", "last_name", "phone_number"];

// Validate and sanitize sort parameters
exports.validateSort = (sortBy, sortOrder) => {
  if (!allowedSortFields.includes(sortBy)) sortBy = "id";

  // Default to ascending order if sortOrder is not provided or invalid
  sortOrder = typeof sortOrder === "string" ? sortOrder.toUpperCase() : "ASC";
  if (!["ASC", "DESC"].includes(sortOrder)) sortOrder = "ASC";
  return { sortBy, sortOrder };
};

// ##################################################################################
// Build search filter for SQL queries
exports.buildSearchFilter = (search) => {
  if (!search) return { whereClause: "", params: [] };
  const allowedSearchFields = [
    "first_name",
    "last_name",
    "phone_number",
    "city",
    "state",
    "pin_code",
  ];
  const placeholders = allowedSearchFields
    .map((key) => `LOWER(${key}) LIKE LOWER(?)`)
    .join(" OR ");
  whereClause = `WHERE ${placeholders}`;
  const params = allowedSearchFields.map(() => `%${search}%`);
  return { whereClause, params };
};

// ##################################################################################
// Pagination helper
exports.getPagination = (totalItems, currentPage = 1, limit = 10) => {
  const MAX_LIMIT = 50;
  limit = parseInt(limit);
  currentPage = parseInt(currentPage);

  if (limit < 1) limit = 10;
  if (limit > MAX_LIMIT) limit = MAX_LIMIT; // Enforce Max limit

  // Ensure currentPage and limit are within valid ranges
  const totalPages = Math.ceil(totalItems / limit);
  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  const offset = (currentPage - 1) * limit; // Calculate offset for SQL query

  return {
    currentPage,
    totalPages,
    limit,
    offset,
  };
};

// Update only one Address Flag
exports.updateOnlyOneAddressFlag = async (customerId, addressId) => {
  if (!customerId && addressId) {
    const address = await dbGet("SELECT * FROM addresses WHERE id = ?", [
      addressId,
    ]);
    customerId = address["customer_id"];
  }

  if (!customerId) {
    throw new Error("customerId is required to update only_one_address flag.");
  }

  const result = await dbGet(
    "SELECT COUNT(*) AS address_count FROM addresses WHERE customer_id  = ?",
    [customerId]
  );
  const onlyOne = result.address_count === 1;
  await dbRun("UPDATE customers SET only_one_address = ? WHERE id = ?", [
    onlyOne,
    customerId,
  ]);
};
