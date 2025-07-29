const dotenv = require("dotenv");
dotenv.config();
<<<<<<< HEAD
const cors = require("cors");
=======
>>>>>>> 2c9f6d2d404529479f2aea0456b0cfafb6ea214d

const express = require("express");
const path = require("path"); // ✅ Add this line
const bodyParser = require("body-parser");
<<<<<<< HEAD
const path = require("path"); // ✅ <-- this is what you're missing

=======

// Route imports
const facilityRoutes = require("./routes/facilityRoutes");
const authRoutes = require("./routes/authRoutes");
// const eventRoutes = require("./routes/eventRoutes");
// const medicationRoutes = require("./routes/medicationRoutes");
// const chatRoutes = require("./routes/chatRoutes");
// const appointmentRoutes = require("./routes/appointmentRoutes");
// const accessibilityRoutes = require("./routes/accessibilityRoutes");

>>>>>>> 2c9f6d2d404529479f2aea0456b0cfafb6ea214d
const app = express();
app.use(cors());
const port = process.env.PORT || 3000;
const onemapRoutes = require('./onemap/onemapRoutes');
app.use('/api/onemap', onemapRoutes);

// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

<<<<<<< HEAD
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
=======
// Mount active routes
app.use("/api/auth", authRoutes);
app.use("/api/facilities", facilityRoutes);
// app.use("/api/events", eventRoutes);
// app.use("/api/medications", medicationRoutes);
>>>>>>> 2c9f6d2d404529479f2aea0456b0cfafb6ea214d
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

