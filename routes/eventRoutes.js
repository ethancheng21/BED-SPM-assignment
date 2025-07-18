const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");

router.get("/", eventController.getAllEvents);
router.get("/:id", eventController.getEventById);
router.post("/:id/rsvp", eventController.rsvpToEvent);
router.delete("/:id/rsvp", eventController.cancelRsvp);


module.exports = router;
