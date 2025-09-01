const db = require("../utils/db");
const sendResponse = require("../utils/sendResponse");
const util = require("util");

const dbGet = util.promisify(db.get).bind(db);

// Middleware to check if a customer exists by ID
const checkCustomerExists = async (req, res, next) => {
  const customerId = Number(req.params.id);
  if (isNaN(customerId)) {
    return res.status(400).json({ message: "Invalid customer ID" });
  }

  try {
    const query = "SELECT * FROM customers WHERE id = ?";
    const customer = await dbGet(query, [customerId]);

    if (!customer) {
      return sendResponse(res, 404, "Customer not found");
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = checkCustomerExists;
