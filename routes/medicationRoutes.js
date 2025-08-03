const express = require("express");
const router = express.Router();
const medicationController = require("../controllers/medicationController");
const { authenticateJWT } = require("../middlewares/authMiddleware");

// Secure all medication routes with JWT
router.post("/", authenticateJWT, medicationController.createMedication);
router.get("/user", authenticateJWT, medicationController.getMedicationsByUser);
router.delete("/:id", authenticateJWT, medicationController.deleteMedication);

module.exports = router;
