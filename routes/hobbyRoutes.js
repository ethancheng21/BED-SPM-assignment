const express = require("express");
const router = express.Router();
const hobbyController = require("../controllers/hobbyController");
const { authenticateJWT } = require("../middlewares/authMiddleware");

// Public routes
router.get("/", hobbyController.getAllHobbies);
router.get("/user/:userId", hobbyController.getUserHobbies);
router.get("/:id", hobbyController.getHobbyDetails);

// Protected routes
router.post("/:id/join", authenticateJWT, hobbyController.joinHobby);
router.delete("/:id/leave", authenticateJWT, hobbyController.leaveHobby);

module.exports = router;
