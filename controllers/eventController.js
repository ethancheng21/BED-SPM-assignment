const eventModel = require("../models/eventModel");

const getAllEvents = async (req, res) => {
  try {
    const events = await eventModel.fetchAllEvents();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await eventModel.fetchEventById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: "Error fetching event" });
  }
};

const rsvpToEvent = async (req, res) => {
  const eventId = req.params.id;
  const { userId } = req.body;

  try {
    const defaultStatus = "going";
    await eventModel.insertRsvp(userId, eventId, defaultStatus);
    res.status(201).json({ message: "RSVP successful" });
  } catch (err) {
    console.error("RSVP error:", err.message);
    res.status(500).json({ error: "Failed to RSVP for event" });
  }
};


const cancelRsvp = async (req, res) => {
  const eventId = req.params.id;
  const { userId } = req.body;

  try {
    await eventModel.deleteRsvp(userId, eventId);
    res.status(200).json({ message: "RSVP cancelled" });
  } catch (err) {
    console.error("Cancel RSVP error:", err.message);
    res.status(500).json({ error: "Failed to cancel RSVP" });
  }
};


module.exports = {
  getAllEvents,
  getEventById,
  rsvpToEvent,
  cancelRsvp,
};