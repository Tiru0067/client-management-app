const sendResponse = require("../utils/sendResponse");
const customersService = require("../customers/customersService");

// Get all customers with optional search, sorting, and pagination
exports.getAllCustomers = async (req, res, next) => {
  try {
    // Extract query parameters
    let { search, sort_by, sort_order, page, limit, only_one_address } =
      req.query;

    const { customers, currentPage, totalPages, totalItems, pageLimit } =
      await customersService.getCustomers(
        search,
        sort_by,
        sort_order,
        page,
        limit,
        only_one_address
      );

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

// Post a new customer
exports.postCustomer = async (req, res, next) => {
  try {
    // Implementation for adding a new customer
    const { first_name, last_name, phone_number } = req.body || {};
    // Validate input data
    if (!first_name || !last_name || !phone_number) {
      return sendResponse(res, 400, "Missing required fields");
    }
    const newCustomer = await customersService.addCustomer(
      first_name,
      last_name,
      phone_number
    );
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
    const updatedFields = req.body || {};

    // Validate input data - ensure at least one field to update
    if (!updatedFields || Object.keys(updatedFields).length === 0) {
      return sendResponse(res, 400, "Missing required fields");
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
