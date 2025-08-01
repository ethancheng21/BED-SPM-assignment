const db = require("../db");

exports.insertFeedback = async ({ subject, message, email }) => {
  return db.query(
    `INSERT INTO feedback (subject, message, email)
     VALUES (@subject, @message, @email)`,
    { subject, message, email }
  );
};
