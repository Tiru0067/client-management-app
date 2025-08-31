const sendResponse = require("../utils/sendResponse");
const db = require("../utils/db");

// Get all customers
exports.getAllCustomers = (req, res, next) => {
  const sql = "SELECT * FROM customers";
  db.all(sql, [], (err, rows) => {
    if (err) return next(err);
    if (!rows) return sendResponse(res, 404, "No customers found");
    return sendResponse(res, 200, "success", { customers: rows });
  });
};
