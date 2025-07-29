const dotenv = require("dotenv");
dotenv.config();

<<<<<<< HEAD
const express = require("express");
const cors = require("cors");
const path = require("path");
=======
const cors = require("cors");
const express = require("express");
const path = require("path"); // ✅ Only declared once
>>>>>>> 812f2f4f06b0e86007c58a7921f9210fc5ec8280
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;
<<<<<<< HEAD

// Enable CORS
app.use(cors());
=======
>>>>>>> 812f2f4f06b0e86007c58a7921f9210fc5ec8280

// Enable CORS
app.use(cors());

// Parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

<<<<<<< HEAD
// Route files
const onemapRoutes = require("./onemap/onemapRoutes");
const transportRoutes = require("./routes/transportRoutes");
const eventRoutes = require("./routes/eventRoutes");
const facilityRoutes = require("./routes/facilityRoutes");
// const authRoutes = require("./routes/authRoutes");
// const medicationRoutes = require("./routes/medicationRoutes");
// const chatRoutes = require("./routes/chatRoutes");
=======
// Import and use route files
const onemapRoutes = require('./onemap/onemapRoutes');
const eventRoutes = require("./routes/eventRoutes");
const authRoutes = require("./routes/authRoutes");
// const medicationRoutes = require("./routes/medicationRoutes");
const facilityRoutes = require("./routes/facilityRoutes");
const chatRoutes = require("./routes/chatRoutes");
>>>>>>> 812f2f4f06b0e86007c58a7921f9210fc5ec8280
// const appointmentRoutes = require("./routes/appointmentRoutes");
// const accessibilityRoutes = require("./routes/accessibilityRoutes");
const userRoutes = require("./routes/userRoutes");

<<<<<<< HEAD
// Mount all routes under API prefixes
app.use("/api/onemap", onemapRoutes);
app.use("/api/transport", transportRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/facilities", facilityRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/medications", medicationRoutes);
// app.use("/api/chat", chatRoutes);
=======

app.use("/api", userRoutes);
app.use('/api/onemap', onemapRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);
// app.use("/api/medications", medicationRoutes);
app.use("/api/facilities", facilityRoutes);
app.use("/api/chat", chatRoutes);
>>>>>>> 812f2f4f06b0e86007c58a7921f9210fc5ec8280
// app.use("/api/appointments", appointmentRoutes);
// app.use("/api/accessibility", accessibilityRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is working.");
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

<<<<<<< HEAD
// Graceful shutdown
process.on("SIGINT", () => {
  console.log("🔌 Gracefully shutting down...");
=======
// Graceful shutdown handler
process.on("SIGINT", async () => {
  console.log("Gracefully shutting down...");
  // Optional: close DB connections or perform cleanup
>>>>>>> 812f2f4f06b0e86007c58a7921f9210fc5ec8280
  process.exit(0);
});
