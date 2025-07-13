const db = require("../db");

exports.insert = async (data) => {
  return db.query(
    `INSERT INTO medications (user_id, name, dosage, schedule_time, instructions)
     VALUES (@user_id, @name, @dosage, @schedule_time, @instructions)`,
    data
  );
};

exports.getByUserId = async (userId) => {
  return db.query(
    `SELECT * FROM medications WHERE user_id = @userId`,
    { userId }
  );
};

exports.deleteById = async (id) => {
  return db.query(
    `DELETE FROM medications WHERE medication_id = @id`,
    { id }
  );
};
