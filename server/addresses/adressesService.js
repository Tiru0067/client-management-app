const util = require("util");
const db = require("../utils/db");
const { lastAffectedId, changesCount } = require("../utils/helpers");
const {
  updateOnlyOneAddressFlag,
} = require("../customers/customersHelpers.js");

const dbAll = util.promisify(db.all).bind(db);
const dbGet = util.promisify(db.get).bind(db);

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
  await updateOnlyOneAddressFlag(customerId, null);
  return { id: result, ...address };
};

// Update addresses for a specific customer
exports.updateAddressById = async (addressId, addressUpdates) => {
  const keys = Object.keys(addressUpdates);
  if (keys.length === 0) return null; // No updates provided

  const existingAddressQuery = "SELECT * FROM addresses WHERE id = ?";
  const existingAddress = await dbGet(existingAddressQuery, [addressId]);
  const newAddress = { ...existingAddress, ...addressUpdates }; // Merge existing address with updates
  const columns = Object.keys(newAddress).filter((key) => key !== "id");
  const placeholders = columns.map((key) => `${key} = ?`);
  const params = columns.map((key) => newAddress[key]);
  params.push(addressId);

  const sql = `UPDATE addresses SET ${placeholders} WHERE id = ?`;
  const changes = await changesCount(sql, params);
  if (changes === 0) return null;

  const updatedAddressSql = "SELECT * FROM addresses WHERE id = ?";
  const updatedAddress = await dbGet(updatedAddressSql, addressId);
  await updateOnlyOneAddressFlag(existingAddress["customer_id"], null);
  return updatedAddress;
};

// Delete address by address ID
exports.deleteAddressById = async (addressId) => {
  const query = "DELETE FROM addresses WHERE id = ?";
  const result = await changesCount(query, [addressId]);
  await updateOnlyOneAddressFlag(null, addressId);
  return result > 0;
};
