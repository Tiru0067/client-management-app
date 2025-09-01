const db = require("../utils/db");
const sendResponse = require("../utils/sendResponse");
const util = require("util");

const dbGet = util.promisify(db.get).bind(db);

// Middleware to check if a address exists by ID
const checkAddressExists = async (req, res, next) => {
  const addressId = req.params.addressId;
  if (isNaN(addressId)) {
    return res.status(400).json({ message: "Invalid Address ID" });
  }

  try {
    const query = "SELECT * FROM addresses WHERE id = ?";
    const address = await dbGet(query, [addressId]);

    if (!address) {
      return sendResponse(res, 404, "Address not found");
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = checkAddressExists;
