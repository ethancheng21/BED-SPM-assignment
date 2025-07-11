const db = require("../db");

exports.createMedication = async (req, res) => {
  const { user_id, name, dosage, schedule_time, instructions } = req.body;

  console.log("Received data for medication:", req.body); // ✅ NEW: log input

  try {
    await db.query(
      `INSERT INTO medications (user_id, name, dosage, schedule_time, instructions)
       VALUES (@user_id, @name, @dosage, @schedule_time, @instructions)`,
      { user_id, name, dosage, schedule_time, instructions }
    );

    res.status(201).json({ message: "Medication added" });
  } catch (err) {
    console.error("❌ Medication insert error:", err); // ✅ NEW: log full error
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.getMedicationsByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await db.query(`
      SELECT * FROM medications WHERE user_id = @userId
    `, { userId });
    
    console.log("DB Result:", result); // ← TEMP LOG
    res.json(result.recordset);
  } catch (err) {
    console.error("ERROR:", err); // ← SEE ERROR IN TERMINAL
    res.status(500).json({ error: err.message });
  }
};


exports.deleteMedication = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query(`DELETE FROM medications WHERE medication_id = @id`, { id });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
