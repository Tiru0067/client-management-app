const sendResponse = require("../utils/sendResponse");
const addressesService = require("../addresses/adressesService");

// Get addresses for a specific customer
exports.getAddressesByCustomerId = async (req, res, next) => {
  try {
    const customerId = req.params.id;
    const addresses = await addressesService.getAddressesByCustomerId(
      customerId
    );
    if (!addresses)
      return sendResponse(res, 404, "No addresses found for this customer");
    return sendResponse(res, 200, "success", { addresses });
  } catch (error) {
    next(error);
  }
};

// Add a new address for a specific customer
exports.addAddressByCustomerId = async (req, res, next) => {
  try {
    const customerId = req.params.id;
    const address = req.body; // Assuming addresses are sent in the request body
    const newAddress = await addressesService.addnewAddressByCustomerId({
      customerId,
      address,
    });
    if (!newAddress) return sendResponse(res, 400, "Failed to add address");
    return sendResponse(res, 201, "Address added successfully", {
      address: newAddress,
    });
  } catch (error) {
    next(error);
  }
};

// Update a specific address for a customer
exports.updateAddressById = async (req, res, next) => {
  try {
    const addressId = req.params.addressId;
    const addressUpdates = req.body; // Assuming updates are sent in the request body
    const updatedAddress = await addressesService.updateAddressById(
      addressId,
      addressUpdates
    );
    if (!updatedAddress)
      return sendResponse(res, 404, "Address not found or no changes made");
    return sendResponse(res, 200, "Address updated successfully", {
      address: updatedAddress,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a specific address by address ID
exports.deleteAddressById = async (req, res, next) => {
  try {
    const addressId = req.params.addressId;
    const deleted = await addressesService.deleteAddressById(addressId);
    if (!deleted) return sendResponse(res, 404, "Address not found");
    return sendResponse(res, 200, "Address deleted successfully");
  } catch (error) {
    next(error);
  }
};
