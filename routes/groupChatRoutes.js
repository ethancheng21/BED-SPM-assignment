const express = require("express");
const router = express.Router();
const groupchatController = require("../controllers/groupChatController");
const { authenticateJWT } = require("../middlewares/authMiddleware");

// Public: View messages in hobby group
router.get("/:hobbyId", groupchatController.getMessages);

// Protected: Post message in hobby group
router.post("/:hobbyId", authenticateJWT, groupchatController.postMessage);

module.exports = router;
