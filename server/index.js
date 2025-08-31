const express = require("express");
const cors = require("cors");
const customersRoutes = require("./routes/customersRoutes");

// Create an Express application
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/customers", customersRoutes);

// Set the port number from environment variable or default to 3000
const PORT = process.env.PORT || 3000;

// 🚀 Start the server and listen on the specified port
app.listen(PORT, () =>
  console.log(`Server is running on port http://localhost:${PORT}`)
);
