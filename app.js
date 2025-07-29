const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Import routes
const onemapRoutes = require("./onemap/onemapRoutes");
const transportRoutes = require("./routes/transportRoutes");
const eventRoutes = require("./routes/eventRoutes");
const hobbyRoutes = require("./routes/hobbyRoutes");
const groupchatRoutes = require("./routes/groupChatRoutes");
const facilityRoutes = require("./routes/facilityRoutes");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const userRoutes = require("./routes/userRoutes");

// Mount routes
app.use("/api/onemap", onemapRoutes);
app.use("/api/transport", transportRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/hobbies", hobbyRoutes);
app.use("/api/groupchat", groupchatRoutes);
app.use("/api/facilities", facilityRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api", userRoutes); // Mount userRoutes under /api

// Test route
app.get("/", (req, res) => {
  res.send("API is working.");
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("🔌 Gracefully shutting down...");
  process.exit(0);
});