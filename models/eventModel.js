const { poolPromise } = require("../db");

// Fetch all events
const fetchAllEvents = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT event_id, title, description, date, time, location, category
    FROM events
  `);
  return result.recordset;
};

// Fetch event by ID
const fetchEventById = async (eventId) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("eventId", eventId)
    .query(`
      SELECT event_id, title, description, date, time, location, category
      FROM events
      WHERE event_id = @eventId
    `);
  return result.recordset[0];
};

// Check if user has already RSVP'd for the event
const checkExistingRsvp = async (userId, eventId) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("userId", userId)
    .input("eventId", eventId)
    .query(`
      SELECT * FROM rsvps WHERE user_id = @userId AND event_id = @eventId
    `);
  
  return result.recordset.length > 0;  // Returns true if RSVP exists, false if not
};

// Insert RSVP if it doesn't exist
const insertRsvp = async (userId, eventId, status) => {
  const pool = await poolPromise;
  
  // Check if the RSVP already exists
  const existingRsvp = await checkExistingRsvp(userId, eventId);
  
  if (existingRsvp) {
    throw new Error("You have already RSVP'd to this event."); // Prevent duplicate RSVP
  }

  // Insert RSVP into the database
  await pool
    .request()
    .input("userId", userId)
    .input("eventId", eventId)
    .input("status", status)
    .query(`
      INSERT INTO rsvps (user_id, event_id, status)
      VALUES (@userId, @eventId, @status)
    `);
};

// Delete RSVP
const deleteRsvp = async (userId, eventId) => {
  const pool = await poolPromise;
  await pool
    .request()
    .input("userId", userId)
    .input("eventId", eventId)
    .query(`
      DELETE FROM rsvps
      WHERE user_id = @userId AND event_id = @eventId
    `);
};

module.exports = {
  fetchAllEvents,
  fetchEventById,
  insertRsvp,
  deleteRsvp,
  checkExistingRsvp, // Export checkExistingRsvp function
};
