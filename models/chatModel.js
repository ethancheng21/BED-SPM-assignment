const { poolPromise, sql } = require("../db");

async function saveMessage(senderId, receiverId, content) {
  const pool = await poolPromise;
  await pool.request()
    .input("sender_id", sql.Int, senderId)
    .input("receiver_id", sql.Int, receiverId)
    .input("content", sql.Text, content)
    .query(`
      INSERT INTO messages (sender_id, receiver_id, content)
      VALUES (@sender_id, @receiver_id, @content)
    `);
}

async function getMessagesBetweenUsers(user1, user2) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input("user1", sql.Int, user1)
    .input("user2", sql.Int, user2)
    .query(`
      SELECT * FROM messages
      WHERE (sender_id = @user1 AND receiver_id = @user2)
         OR (sender_id = @user2 AND receiver_id = @user1)
      ORDER BY timestamp ASC
    `);
  return result.recordset;
}

module.exports = {
  saveMessage,
  getMessagesBetweenUsers,
};
