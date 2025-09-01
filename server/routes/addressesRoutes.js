const express = require("express");
const addressesController = require("../controllers/addressesController");
const checkAddressExists = require("../middleware/checkAddressExists");
const parseIdParam = require("../middleware/parseIdParam");

const router = express.Router();

const { updateAddressById, deleteAddressById } = addressesController;

router
  .route("/:addressId")
  .all(parseIdParam("addressId")) // Middleware to parse and validate ID parameter
  .all(checkAddressExists) // Middleware to check if Address exists
  .put(updateAddressById) // Note: Update addresses
  .delete(deleteAddressById); // Note: Delete address

module.exports = router;
