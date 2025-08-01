const {
  fetchAllEvents,
  fetchEventById,
  insertRsvp,
  deleteRsvp,
  checkExistingRsvp,  // Import this function from your model
} = require("../models/eventModel");

// GET /api/events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await fetchAllEvents();
    res.json(events);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ message: "Error fetching events" });
  }
};

// GET /api/events/:id
exports.getEventById = async (req, res) => {
  const eventId = parseInt(req.params.id);
  try {
    const event = await fetchEventById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (err) {
    console.error("Error fetching event:", err);
    res.status(500).json({ message: "Error fetching event" });
  }
};

// POST /api/events/:id/rsvp
exports.rsvpToEvent = async (req, res) => {
  const userId = req.userId;
  const eventId = parseInt(req.params.id);
  const { status } = req.body;

  try {
    await insertRsvp(userId, eventId, status || "going");
    res.status(200).json({ message: "RSVP recorded" });
  } catch (err) {
    console.error("Error inserting RSVP:", err);
    res.status(400).json({ message: err.message });  // Send error message to frontend
  }
};


// DELETE /api/events/:id/unrsvp
exports.unrsvpFromEvent = async (req, res) => {
  const userId = req.userId;
  const eventId = parseInt(req.params.id);

  try {
    await deleteRsvp(userId, eventId);
    res.status(200).json({ message: "RSVP removed" });
  } catch (err) {
    console.error("Error deleting RSVP:", err);
    res.status(500).json({ message: "Error deleting RSVP" });
  }
};
