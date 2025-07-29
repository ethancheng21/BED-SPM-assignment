const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const path = require("path"); // ✅ Add this line
const bodyParser = require("body-parser");

// Route imports
const facilityRoutes = require("./routes/facilityRoutes");
const authRoutes = require("./routes/authRoutes");
// const eventRoutes = require("./routes/eventRoutes");
// const medicationRoutes = require("./routes/medicationRoutes");
// const chatRoutes = require("./routes/chatRoutes");
// const appointmentRoutes = require("./routes/appointmentRoutes");
// const accessibilityRoutes = require("./routes/accessibilityRoutes");

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Mount active routes
app.use("/api/auth", authRoutes);
app.use("/api/facilities", facilityRoutes);
// app.use("/api/events", eventRoutes);
// app.use("/api/medications", medicationRoutes);
// app.use("/api/chat", chatRoutes);
// app.use("/api/appointments", appointmentRoutes);
// app.use("/api/accessibility", accessibilityRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is working.");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Graceful shutdown handler
process.on("SIGINT", async () => {
  console.log("Gracefully shutting down...");
  // Optional: Close DB connections or cleanup here
  process.exit(0);
});

