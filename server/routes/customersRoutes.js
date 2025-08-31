const express = require("express");
const costumersController = require("../controllers/customersController");

const {
  getAllCustomers,
  postCustomer,
  getCustomerById,
  updateCustomerById,
  deleteCustomerById,
} = costumersController;

// Router instance
const router = express.Router();

// Routes
router
  .route("/")
  .get(getAllCustomers) // Get all customers
  .post(postCustomer); // Add a new customer

router
  .route("/:id")
  .get(getCustomerById) // Get customer by ID
  .put(updateCustomerById) // Update customer by ID
  .delete(deleteCustomerById); // Delete customer by ID

module.exports = router;
