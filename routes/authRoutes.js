const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticateJWT } = require('../middlewares/authMiddleware');

router.post("/register", authController.register);
router.post("/login", authController.login);

// Protected routes
router.get("/profile", authenticateJWT, authController.getProfile);
router.put("/profile", authenticateJWT, authController.updateProfile);

module.exports = router;
