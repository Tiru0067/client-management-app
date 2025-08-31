const express = require("express");
const db = require("../utils/db");
const costumersController = require("../controlers/customersController");

const { getAllCustomers } = costumersController;

// Router instance
const router = express.Router();

router
  .route("/")
  // Get all customers
  .get(getAllCustomers);

module.exports = router;
