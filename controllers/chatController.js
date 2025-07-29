const chatModel = require("../models/chatModel");

exports.sendMessage = async (req, res) => {
  const { sender_id, receiver_id, content } = req.body;
  try {
    await chatModel.saveMessage(sender_id, receiver_id, content);
    res.status(201).json({ message: "Message sent." });
  } catch (err) {
    res.status(500).json({ error: "Failed to send message", details: err.message });
  }
};

exports.getChat = async (req, res) => {
  const { user1, user2 } = req.query;
  try {
    const messages = await chatModel.getMessagesBetweenUsers(user1, user2);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to get messages", details: err.message });
  }
};
