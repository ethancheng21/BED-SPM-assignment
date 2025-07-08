const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const sql = require("mssql");

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// (Optional) Serve static files if needed
app.use(express.static(path.join(__dirname, "public")));

// Register route files here
const eventRoutes = require("./routes/eventRoutes");
// const authRoutes = require("./routes/authRoutes");
// const medicationRoutes = require("./routes/medicationRoutes");
// const facilityRoutes = require("./routes/facilityRoutes");
// const chatRoutes = require("./routes/chatRoutes");
// const appointmentRoutes = require("./routes/appointmentRoutes");
// const accessibilityRoutes = require("./routes/accessibilityRoutes");

// Mount all routes under API prefixes
app.use("/api/events", eventRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/medications", medicationRoutes);
// app.use("/api/facilities", facilityRoutes);
// app.use("/api/chat", chatRoutes);
// app.use("/api/appointments", appointmentRoutes);
// app.use("/api/accessibility", accessibilityRoutes);

// Test route (optional)
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
  await sql.close();
  process.exit(0);
});
