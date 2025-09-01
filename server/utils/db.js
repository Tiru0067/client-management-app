const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Define the path to the SQLite database file
const dbPath = path.resolve(__dirname, "../customer_management.db");

// Open the database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

db.serialize(() => {
  // Enable foreign key constraints
  db.run("PRAGMA foreign_keys = ON");

  // Create customers table if it doesn't exist
  db.run(
    `CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        phone_number TEXT NOT NULL UNIQUE
        only_one_address BOOLEAN DEFAULT 0
    )`,
    (err) => {
      if (err) {
        console.error("Error creating customers table:", err.message);
      } else {
        console.log("Customers table exists or created successfully.");
      }
    }
  );

  //   Create addresses table if it doesn't exist
  db.run(
    `CREATE TABLE IF NOT EXISTS addresses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER,
        address_details TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        pin_code TEXT NOT NULL,
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
    )`,
    (err) => {
      if (err) {
        console.error("Error creating addresses table:", err.message);
      } else {
        console.log("Addresses table exists or created successfully.");
      }
    }
  );
});

module.exports = db;
