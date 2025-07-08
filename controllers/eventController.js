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
  const { userId, status } = req.body;

  if (!userId || !status) {
    return res.status(400).json({ message: "Missing userId or status" });
  }

  try {
    await eventModel.insertRsvp(userId, eventId, status);
    res.status(201).json({ message: "RSVP saved to database." });
  } catch (err) {
    console.error("RSVP insert error:", err);
    res.status(500).json({ error: "Failed to insert RSVP" });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  rsvpToEvent,
};