const db = require("../db");

// Insert new appointment
exports.insertAppointment = async ({ user_id, doctor_name, location, appointment_date, notes }) => {
  return db.query(
    `INSERT INTO appointments 
     (user_id, doctor_name, location, appointment_date, notes)
     VALUES (@user_id, @doctor_name, @location, @appointment_date, @notes)`,
    { user_id, doctor_name, location, appointment_date, notes }
  );
};

// Get ALL appointments for a user (past and future)
exports.getAllAppointmentsByUserId = async (userId) => {
  return db.query(
    `SELECT * FROM appointments 
     WHERE user_id = @userId
     ORDER BY appointment_date DESC`,
    { userId }
  );
};
