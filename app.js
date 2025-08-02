const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");

// Initialize express app
const app = express();
const port = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Import Route files
const onemapRoutes = require("./onemap/onemapRoutes");
const transportRoutes = require("./routes/transportRoutes");
const eventRoutes = require("./routes/eventRoutes");
const hobbyRoutes = require("./routes/hobbyRoutes");
const groupchatRoutes = require("./routes/groupChatRoutes");
const facilityMapsRoutes = require("./routes/facilityMapsRoutes"); // Correct route for facilities

// Mount all routes under API prefixes
app.use("/api/onemap", onemapRoutes);
app.use("/api/transport", transportRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/hobbies", hobbyRoutes);
app.use("/api/groupchat", groupchatRoutes);
app.use("/api/facilityMaps", facilityMapsRoutes); // ✅ Must match the URL you're using


// Test route to check if API is working
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
