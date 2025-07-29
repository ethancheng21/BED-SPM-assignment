const { poolPromise } = require("../db");

const fetchAllEvents = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT event_id, title, description, date, time, location, category
    FROM events
  `);
  return result.recordset;
};

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

const insertRsvp = async (userId, eventId, status) => {
  const pool = await poolPromise;
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
};
