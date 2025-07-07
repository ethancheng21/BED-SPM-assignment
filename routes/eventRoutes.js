const express = require('express');
const router = express.Router();
const {
  getAllEvents,
  getEventById,
  createEvent,
  rsvpToEvent
} = require('../controllers/eventController');

// Optional auth middleware for protected routes
const { verifyToken } = require('../middleware/authMiddleware');

// ROUTES:

// GET /api/events — Get all events (public)
router.get('/', getAllEvents);

// GET /api/events/:id — Get a single event by ID (public)
router.get('/:id', getEventById);

// POST /api/events — Create a new event (protected route)
router.post('/', verifyToken, createEvent);

// POST /api/events/:id/rsvp — RSVP to an event (protected route)
router.post('/:id/rsvp', verifyToken, rsvpToEvent);

module.exports = router;
