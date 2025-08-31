const express = require("express");
const db = require("../utils/db");

// Router instance
const router = express.Router();

router
  .route("/")
  // Get all customers
  .get((req, res) => {
    const sql = "SELECT * FROM customers";
    db.all(sql, [], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ customers: rows });
    });
  });

module.exports = router;
