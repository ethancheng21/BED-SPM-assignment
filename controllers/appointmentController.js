const Appointment = require("../models/appointmentModel");

exports.getAllAppointments = async (req, res) => {
  try {
    const result = await Appointment.getAllAppointmentsByUserId(req.params.userId);
    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Error fetching appointments:", err.message);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
};

exports.createAppointment = async (req, res) => {
  try {
    await Appointment.insertAppointment(req.body);
    res.status(201).json({ message: "Appointment created" });
  } catch (err) {
    console.error("❌ Appointment insert failed:", err.message);
    res.status(500).json({ error: err.message });
  }
};
