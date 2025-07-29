const { poolPromise, sql } = require("../db");

// GET /api/friends/:userId
exports.getFriends = async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("userId", sql.Int, userId)
      .query(`
        SELECT user_id, name FROM users
        WHERE user_id != @userId
      `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch friends", details: err.message });
  }
};
