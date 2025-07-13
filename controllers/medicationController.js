const Medication = require("../models/medicationModel");

exports.createMedication = async (req, res) => {
  try {
    await Medication.insert(req.body);
    res.status(201).json({ message: "Medication added" });
  } catch (err) {
    console.error("❌ Medication insert error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getMedicationsByUser = async (req, res) => {
  try {
    const result = await Medication.getByUserId(req.params.userId);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteMedication = async (req, res) => {
  try {
    await Medication.deleteById(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
