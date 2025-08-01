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

// Get upcoming appointments for a user
exports.getUpcomingAppointmentsByUserId = async (userId) => {
  return db.query(
    `SELECT * FROM appointments 
     WHERE user_id = @userId AND appointment_date > GETDATE()
     ORDER BY appointment_date ASC`,
    { userId }
  );
};
