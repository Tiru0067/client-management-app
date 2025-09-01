const db = require("../utils/db");

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
  whereClause = `WHERE LOWER(first_name) LIKE LOWER(?) OR LOWER(last_name) LIKE LOWER(?) OR phone_number LIKE ?`;
  const searchParam = `%${search}%`;
  const params = [searchParam, searchParam, searchParam];
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
