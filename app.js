// Only require dotenv once
const dotenv = require("dotenv");
dotenv.config();  // Load environment variables

const express = require("express");
const bodyParser = require("body-parser");
const facilityRoutes = require("./routes/facilityRoutes"); // Import the facilities route

// Initialize express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use the facilities route for the /facilities path
app.use("/facilities", facilityRoutes);

// Test route to check if the server is working
app.get("/", (req, res) => {
  res.send("API is working.");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Gracefully shutting down...");
  // Close any database connections or other cleanups
  process.exit(0);
});
