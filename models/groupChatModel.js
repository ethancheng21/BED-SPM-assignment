const { poolPromise } = require("../db");

const fetchMessagesByHobbyId = async (hobbyId) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input("hobbyId", hobbyId)
    .query(`
      SELECT m.message_id, m.content, m.timestamp, u.name AS sender_name
      FROM hobby_messages m
      JOIN users u ON m.sender_id = u.user_id
      WHERE m.hobby_id = @hobbyId
      ORDER BY m.timestamp ASC OFFSET 0 ROWS FETCH NEXT 40 ROWS ONLY
    `);
  return result.recordset;
};

const insertMessage = async (hobbyId, userId, content) => {
  const pool = await poolPromise;
  await pool.request()
    .input("hobbyId", hobbyId)
    .input("userId", userId)
    .input("content", content)
    .query(`
      INSERT INTO hobby_messages (hobby_id, sender_id, content)
      VALUES (@hobbyId, @userId, @content)
    `);
};

module.exports = {
  fetchMessagesByHobbyId,
  insertMessage,
};
