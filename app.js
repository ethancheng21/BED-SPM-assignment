const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const path = require("path"); // ✅ Only declared once
const bodyParser = require("body-parser");

const app = express(); // ✅ Must be declared before any app.use()
const port = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// ✅ Mount feedback routes after app is defined
const feedbackRoutes = require('./routes/feedbackRoutes');
app.use('/api/feedback', feedbackRoutes); // ✅ This works now

// Import and use route files
const onemapRoutes = require('./onemap/onemapRoutes');
const eventRoutes = require("./routes/eventRoutes");
const hobbyRoutes = require("./routes/hobbyRoutes");
const groupchatRoutes = require("./routes/groupChatRoutes");
const facilityRoutes = require("./routes/facilityRoutes");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const accessibilityRoutes = require("./routes/accessibilityRoutes");
const userRoutes = require("./routes/userRoutes");
const faqRoutes = require("./routes/faqRoutes");  // Import FAQ routes

// Mount all routes under API prefixes
app.use("/api", userRoutes);
app.use('/api/onemap', onemapRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/faqs", faqRoutes);  // Mount FAQ routes at '/api/faqs'

// Test route
app.get("/", (req, res) => {
  res.send("API is working.");
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

// Graceful shutdown handler
process.on("SIGINT", async () => {
  console.log("Gracefully shutting down...");
  // Optional: close DB connections or perform cleanup
  process.exit(0);
});