// models/feedbackModel.js
const db = require("../db");
const sql = db.sql;

exports.insertFeedback = async ({ subject, message, email }) => {
  const request = await db.request();

  await request
    .input("subject", sql.NVarChar, subject)
    .input("message", sql.NVarChar, message)
    .input("email", sql.NVarChar, email || null)
    .query(`
      INSERT INTO [seniors_app].[dbo].[feedback] (subject, message, email)
      VALUES (@subject, @message, @email)
    `);
};
