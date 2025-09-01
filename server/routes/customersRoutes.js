const express = require("express");
const costumersController = require("../controllers/customersController");
const addressesController = require("../controllers/addressesController");
const checkCustomerExists = require("../middleware/checkCustomerExists");
const parseIdParam = require("../middleware/parseIdParam");

const {
  getAllCustomers,
  postCustomer,
  getCustomerById,
  updateCustomerById,
  deleteCustomerById,
} = costumersController;

const { getAddressesByCustomerId, addAddressByCustomerId } =
  addressesController;

// Router instance
const router = express.Router();

// Routes
router
  .route("/")
  .get(getAllCustomers) // Get all customers
  .post(postCustomer); // Add a new customer

router
  .route("/:id")
  .all(parseIdParam("id")) // Middleware to parse and validate ID parameter
  .all(checkCustomerExists) // Middleware to check if customer exists
  .get(getCustomerById) // Get customer by ID
  .put(updateCustomerById) // Update customer by ID
  .delete(deleteCustomerById); // Delete customer by ID

router
  .route("/:id/addresses")
  .all(parseIdParam("id")) // Middleware to parse and validate ID parameter
  .all(checkCustomerExists) // Middleware to check if customer exists
  .get(getAddressesByCustomerId) // Get addresses for a specific customer
  .post(addAddressByCustomerId); // Update addresses for a specific customer

module.exports = router;
