const dotenv = require("dotenv");
dotenv.config();

const cors = require("cors");
const express = require("express");
const path = require("path"); // ✅ Only declared once
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Import and use route files
const onemapRoutes = require('./onemap/onemapRoutes');
const eventRoutes = require("./routes/eventRoutes");
const authRoutes = require("./routes/authRoutes");
// const medicationRoutes = require("./routes/medicationRoutes");
const facilityRoutes = require("./routes/facilityRoutes");
// const chatRoutes = require("./routes/chatRoutes");
// const appointmentRoutes = require("./routes/appointmentRoutes");
// const accessibilityRoutes = require("./routes/accessibilityRoutes");

app.use('/api/onemap', onemapRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);
// app.use("/api/medications", medicationRoutes);
app.use("/api/facilities", facilityRoutes);
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
  // Optional: close DB connections or perform cleanup
  process.exit(0);
});
