const hobbyModel = require("../models/hobbyModel");

const getAllHobbies = async (req, res) => {
  const search = req.query.search || "";
  try {
    const hobbies = await hobbyModel.fetchAllHobbies(search);
    res.json(hobbies);
  } catch (err) {
    console.error("Fetch hobbies error:", err);
    res.status(500).json({ error: "Failed to fetch hobbies" });
  }
};

const getUserHobbies = async (req, res) => {
  const userId = req.params.userId;
  try {
    const hobbies = await hobbyModel.fetchUserHobbies(userId);
    res.json(hobbies);
  } catch (err) {
    console.error("Fetch user hobbies error:", err);
    res.status(500).json({ error: "Failed to get user's hobbies" });
  }
};


const getHobbyDetails = async (req, res) => {
  const hobbyId = req.params.id;
  try {
    const hobbyData = await hobbyModel.fetchHobbyWithMembers(hobbyId);
    if (!hobbyData) {
      return res.status(404).json({ message: "Hobby group not found" });
    }
    res.json(hobbyData);
  } catch (err) {
    console.error("Fetch hobby details error:", err);
    res.status(500).json({ error: "Failed to load hobby details" });
  }
};

const joinHobby = async (req, res) => {
  const hobbyId = req.params.id;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "Missing userId" });
  }

  try {
    await hobbyModel.insertHobbyMember(userId, hobbyId);
    res.status(201).json({ message: "Joined hobby group." });
  } catch (err) {
    if (err.message.includes("already joined")) {
      res.status(400).json({ message: err.message });
    } else {
      console.error("Join hobby error:", err);
      res.status(500).json({ error: "Failed to join hobby" });
    }
  }
};

const leaveHobby = async (req, res) => {
  const hobbyId = req.params.id;
  const { userId } = req.body;

  console.log("Leave route hit:", { hobbyId, userId });

  if (!userId) {
    return res.status(400).json({ message: "Missing userId" });
  }

  try {
    await hobbyModel.removeHobbyMember(userId, hobbyId);
    res.json({ message: "Left hobby group." });
  } catch (err) {
    console.error("Leave hobby error:", err);
    res.status(500).json({ error: "Failed to leave hobby group" });
  }
};



module.exports = {
  getAllHobbies,
  getHobbyDetails,
  joinHobby,
  getUserHobbies,
  leaveHobby,
};
