const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { checkUserLoggedIn } = require("../middlewares/authMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/profile", checkUserLoggedIn, authController.getProfile);
router.put("/profile", checkUserLoggedIn, authController.updateProfile);

module.exports = router;
