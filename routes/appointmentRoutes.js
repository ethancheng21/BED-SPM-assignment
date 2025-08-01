const express = require("express");
const router = express.Router();
const controller = require("../controllers/appointmentController");

// GET upcoming appointments for a user
router.get("/user/:userId/upcoming", controller.getUpcomingAppointments);

// POST a new appointment
router.post("/", controller.createAppointment);

module.exports = router;
