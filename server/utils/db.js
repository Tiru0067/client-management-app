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
        email TEXT UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        phone_number TEXT NOT NULL UNIQUE,
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

// Insert Sample customers
db.run(
  `INSERT INTO customers (first_name, last_name, phone_number, email, created_at, updated_at) VALUES
        ('John', 'Doe', '100-000-0001', 'john.doe@example.com', '2024-01-05 10:15:00', '2024-02-10 14:30:00'),
        ('Jane', 'Smith', '100-000-0002', 'jane.smith@example.com', '2024-01-06 11:10:00', '2024-02-12 16:45:00'),
        ('Alice', 'Johnson', '100-000-0003', 'alice.j@example.com', '2024-01-07 09:05:00', '2024-02-14 17:20:00'),
        ('Bob', 'Brown', '100-000-0004', 'bob.brown@example.com', '2024-01-08 13:00:00', '2024-02-15 19:00:00'),
        ('Charlie', 'Davis', '100-000-0005', 'charlie.d@example.com', '2024-01-09 08:25:00', '2024-02-16 12:40:00'),
        ('Eva', 'White', '100-000-0006', 'eva.white@example.com', '2024-01-10 15:30:00', '2024-02-18 18:50:00'),
        ('Frank', 'Green', '100-000-0007', 'frank.g@example.com', '2024-01-11 07:45:00', '2024-02-19 14:30:00'),
        ('Grace', 'Lee', '100-000-0008', 'grace.lee@example.com', '2024-01-12 11:20:00', '2024-02-20 20:15:00'),
        ('Hank', 'Hill', '100-000-0009', 'hank.h@example.com', '2024-01-13 10:10:00', '2024-02-21 21:10:00'),
        ('Ivy', 'Young', '100-000-0010', 'ivy.young@example.com', '2024-01-14 12:00:00', '2024-02-22 22:30:00'),
        ('Jack', 'Black', '100-000-0011', 'jack.black@example.com', '2024-01-15 09:55:00', '2024-02-23 19:45:00'),
        ('Kara', 'Miller', '100-000-0012', 'kara.miller@example.com', '2024-01-16 13:35:00', '2024-02-24 17:55:00'),
        ('Leo', 'Wilson', '100-000-0013', 'leo.wilson@example.com', '2024-01-17 15:45:00', '2024-02-25 18:05:00'),
        ('Mia', 'Moore', '100-000-0014', 'mia.moore@example.com', '2024-01-18 16:15:00', '2024-02-26 19:20:00'),
        ('Nina', 'Taylor', '100-000-0015', 'nina.taylor@example.com', '2024-01-19 11:05:00', '2024-02-27 20:40:00'),`
);

// Inser sample addresses
db.run(`
  INSERT INTO addresses (customer_id, address_details, city, state, pin_code) VALUES
    (1, '123 Maple Street, Apt 4B', 'Los Angeles', 'California', '90001'),
    (1, '456 Oak Avenue, Suite 12', 'San Francisco', 'California', '90002'),
    (2, '789 Pine Road', 'Austin', 'Texas', '73301'),
    (3, '321 Elm Street', 'Miami', 'Florida', '32003'),
    (4, '654 Spruce Lane', 'New York City', 'New York', '10001'),
    (5, '987 Cedar Blvd, Unit 7', 'Las Vegas', 'Nevada', '89044'),
    (6, '222 Birch Street', 'Chicago', 'Illinois', '60007'),
    (7, '333 Chestnut Drive', 'Seattle', 'Washington', '98001'),
    (7, '444 Walnut Street', 'Tacoma', 'Washington', '98002'),
    (8, '555 Fir Avenue', 'Portland', 'Oregon', '97035'),
    (9, '666 Hickory Street', 'Phoenix', 'Arizona', '85001'),
    (10, '777 Aspen Road', 'Denver', 'Colorado', '80014'),
    (11, '888 Redwood Blvd', 'San Diego', 'California', '94101'),
    (12, '999 Poplar Street', 'Boston', 'Massachusetts', '02101'),
    (13, '1010 Sycamore Drive', 'Atlanta', 'Georgia', '30301'),
    (13, '1111 Willow Lane', 'Columbus', 'Georgia', '30303'),
    (14, '1212 Palm Street', 'Reno', 'Nevada', '89101'),
    (15, '1313 Magnolia Ave', 'Orlando', 'Florida', '33101'),
  `);

module.exports = db;
