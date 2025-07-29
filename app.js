const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path"); // ✅ <-- this is what you're missing

const app = express();
app.use(cors());
const port = process.env.PORT || 3000;
const onemapRoutes = require('./onemap/onemapRoutes');
app.use('/api/onemap', onemapRoutes);

// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// (Optional) Serve static files if needed
app.use(express.static(path.join(__dirname, "public")));

// Register route files here
const eventRoutes = require("./routes/eventRoutes");
// const authRoutes = require("./routes/authRoutes");
// const medicationRoutes = require("./routes/medicationRoutes");
const facilityRoutes = require("./routes/facilityRoutes");
// const chatRoutes = require("./routes/chatRoutes");
// const appointmentRoutes = require("./routes/appointmentRoutes");
// const accessibilityRoutes = require("./routes/accessibilityRoutes");

// Mount all routes under API prefixes
app.use("/api/events", eventRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/medications", medicationRoutes);
app.use("/api/facilities", facilityRoutes);
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
  // Close any database connections or other cleanups
  process.exit(0);
});
