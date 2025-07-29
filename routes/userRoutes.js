const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Add friend-list route
router.get("/friends/:userId", userController.getFriends);

module.exports = router;
