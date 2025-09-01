const util = require("util");
const db = require("../utils/db");
const { lastAffectedId, changesCount } = require("../utils/helpers");

const dbAll = util.promisify(db.all).bind(db);

// Get addresses for a specific customer
exports.getAddressesByCustomerId = async (customerId) => {
  const query = "SELECT * FROM addresses WHERE customer_id = ?";
  const addresses = await dbAll(query, [customerId]);
  return addresses;
};

// Add new address for a specific customer
exports.addnewAddressByCustomerId = async ({ customerId, address }) => {
  // Get the keys of the address object
  const keys = Object.keys(address);
  if (keys.length === 0) return null; // No address data provided

  const columns = [...keys, "customer_id"];
  const Placeholders = columns.map(() => "?").join(", "); // Placeholders for values
  const values = [...Object.values(address), customerId]; // Values to be inserted
  const query = `
    INSERT INTO addresses (${columns.join(", ")})
    VALUES (${Placeholders})
  `;
  const result = await lastAffectedId(query, values);
  return { id: result, ...address };
};
