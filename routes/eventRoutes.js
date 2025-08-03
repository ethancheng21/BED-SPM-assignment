const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const { authenticateJWT } = require("../middlewares/authMiddleware");

// Public event routes
router.get("/", eventController.getAllEvents);
router.get("/:id", eventController.getEventById);

// Protected RSVP routes
router.post("/:id/rsvp", authenticateJWT, eventController.rsvpToEvent);
router.delete("/:id/unrsvp", authenticateJWT, eventController.unrsvpFromEvent);

module.exports = router;
