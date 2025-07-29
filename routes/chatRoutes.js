const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

// POST /api/chat/send
router.post("/send", chatController.sendMessage);

// GET /api/chat/history?user1=1&user2=2
router.get("/history", chatController.getChat);

module.exports = router;
