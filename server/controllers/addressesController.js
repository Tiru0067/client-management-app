const sendResponse = require("../utils/sendResponse");
const addressesService = require("../addresses/adressesService");

// Get addresses for a specific customer
exports.getAddressesByCustomerId = async (req, res, next) => {
  try {
    const customerId = id;
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
    const customerId = id;
    const address = req.body.addresses; // Assuming addresses are sent in the request body
    const newAddress = await addressesService.updateAddressesByCustomerId({
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
