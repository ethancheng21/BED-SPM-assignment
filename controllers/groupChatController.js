const { poolPromise } = require("../db");
const chatModel = require("../models/groupChatModel");

const isUserInHobby = async (userId, hobbyId) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input("userId", userId)
    .input("hobbyId", hobbyId)
    .query(`
      SELECT 1 FROM hobby_members 
      WHERE user_id = @userId AND hobby_id = @hobbyId
    `);
  return result.recordset.length > 0;
};

const getMessages = async (req, res) => {
  const { hobbyId } = req.params;
  try {
    const messages = await chatModel.fetchMessagesByHobbyId(hobbyId);
    res.json(messages.reverse()); // Reverse so newest messages show at bottom
  } catch (err) {
    console.error("Fetch messages error:", err);
    res.status(500).json({ message: "Failed to load messages" });
  }
};

const postMessage = async (req, res) => {
  const { hobbyId } = req.params;
  const { userId, content } = req.body;

  if (!userId || !content) {
    return res.status(400).json({ message: "Missing userId or content" });
  }

  try {
    const isMember = await isUserInHobby(userId, hobbyId);
    if (!isMember) {
      return res.status(403).json({ message: "User not in hobby group." });
    }

    await chatModel.insertMessage(hobbyId, userId, content);
    res.status(201).json({ message: "Message sent." });
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ message: "Failed to send message" });
  }
};

module.exports = {
  getMessages,
  postMessage,
};
