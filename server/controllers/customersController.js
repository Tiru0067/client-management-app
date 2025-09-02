const sendResponse = require("../utils/sendResponse");
const customersService = require("../customers/customersService");

// Get all customers with optional search, sorting, and pagination
exports.getAllCustomers = async (req, res, next) => {
  try {
    // Extract query parameters
    let queryOptions = req.query;

    const { customers, currentPage, totalPages, totalItems, pageLimit } =
      await customersService.getCustomers(queryOptions);

    if (!customers) return sendResponse(res, 404, "No customers found");

    return sendResponse(res, 200, "success", {
      customers,
      page: currentPage,
      results: customers.length,
      limit: pageLimit,
      totalItems,
      totalPages,
    });
  } catch (error) {
    next(error);
  }
};

exports.postCustomer = async (req, res, next) => {
  try {
    const data = req.body || {};

    // Required by schema
    const requiredFields = ["first_name", "last_name", "phone_number"];
    const missing = requiredFields.filter((f) => !data[f]);
    if (missing.length > 0) {
      return sendResponse(
        res,
        400,
        `Missing required fields: ${missing.join(", ")}`
      );
    }

    // Allowed input fields (only user-provided columns)
    // NOTE: do NOT include id, created_at, updated_at, only_one_address
    const allowedFields = ["first_name", "last_name", "phone_number", "email"];
    const customerData = {};
    for (const key of allowedFields) {
      if (data[key] !== undefined) customerData[key] = data[key];
    }

    const newCustomer = await customersService.addCustomer(customerData);

    return sendResponse(res, 201, "Customer added successfully", newCustomer);
  } catch (error) {
    next(error);
  }
};

// Get customer by ID
exports.getCustomerById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const customer = await customersService.getCustomerById(id);
    if (!customer) {
      return sendResponse(res, 404, "Customer not found");
    }
    return sendResponse(res, 200, "success", { customer });
  } catch (error) {
    next(error);
  }
};

// Update customer by ID
exports.updateCustomerById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body || {};

    // Allowed fields to update
    const allowedFields = ["first_name", "last_name", "phone_number", "email"];
    const updatedFields = {};

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updatedFields[field] = data[field];
      }
    }

    // Validate: must have at least one field to update
    if (Object.keys(updatedFields).length === 0) {
      return sendResponse(res, 400, "No valid fields to update");
    }

    const updatedCustomer = await customersService.updateCustomerById(
      id,
      updatedFields
    );

    // Check if the update was successful or if the customer was not found
    if (!updatedCustomer || Object.keys(updatedCustomer).length === 0) {
      return sendResponse(res, 404, "Customer not found");
    }

    return sendResponse(
      res,
      200,
      "Customer updated successfully",
      updatedCustomer
    );
  } catch (err) {
    next(err);
  }
};

// Delete customer by ID
exports.deleteCustomerById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await customersService.deleteCustomerById(id);
    if (!result) {
      return sendResponse(res, 404, "Customer not found");
    }
    return sendResponse(res, 200, "Customer deleted successfully", null, {
      deleted_count: result,
    });
  } catch (error) {
    next(error);
  }
};
