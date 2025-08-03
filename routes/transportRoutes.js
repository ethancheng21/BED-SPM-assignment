const express = require("express");
const router = express.Router();
const transportController = require("../controllers/transportController");
const { authenticateJWT } = require("../middlewares/authMiddleware"); // ✅ Correct import

// GET route (public)
router.get("/route", transportController.getPublicTransportRoute);

// Save a route (requires JWT auth)
router.post("/saveRoute", authenticateJWT, transportController.saveRoute);

// Get all saved routes for the logged-in user
router.get("/savedRoutes", authenticateJWT, transportController.getSavedRoutes);

module.exports = router;
