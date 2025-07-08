const { poolPromise } = require("../db");

const fetchAllHobbies = async (search = "") => {
  try {
    const pool = await poolPromise;
    const request = pool.request();

    if (search) {
      request.input("search", `%${search}%`);
      const result = await request.query(`
        SELECT * FROM hobbies 
        WHERE name LIKE @search OR description LIKE @search
      `);
      return result.recordset;
    } else {
      const result = await request.query("SELECT * FROM hobbies");
      return result.recordset;
    }
  } catch (err) {
    console.error("SQL error in fetchAllHobbies:", err.message);
    throw err; // rethrow so the controller returns 500
  }
};


const fetchHobbyWithMembers = async (hobbyId) => {
  const pool = await poolPromise;

  const hobbyResult = await pool.request()
    .input("hobbyId", hobbyId)
    .query("SELECT * FROM hobbies WHERE hobby_id = @hobbyId");

  const memberResult = await pool.request()
    .input("hobbyId", hobbyId)
    .query(`
      SELECT u.user_id, u.name, u.email
      FROM hobby_members hm
      JOIN users u ON hm.user_id = u.user_id
      WHERE hm.hobby_id = @hobbyId
    `);

  return {
    ...hobbyResult.recordset[0],
    members: memberResult.recordset
  };
};

const insertHobbyMember = async (userId, hobbyId) => {
  const pool = await poolPromise;

  // Check if already joined
  const existing = await pool.request()
    .input("userId", userId)
    .input("hobbyId", hobbyId)
    .query(`
      SELECT * FROM hobby_members 
      WHERE user_id = @userId AND hobby_id = @hobbyId
    `);

  if (existing.recordset.length > 0) {
    throw new Error("User already joined this hobby.");
  }

  // Insert if not exists
  await pool.request()
    .input("userId", userId)
    .input("hobbyId", hobbyId)
    .query(`
      INSERT INTO hobby_members (user_id, hobby_id)
      VALUES (@userId, @hobbyId)
    `);
};

const fetchUserHobbies = async (userId) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input("userId", userId)
    .query(`
      SELECT h.hobby_id, h.name, h.description
      FROM hobby_members hm
      JOIN hobbies h ON hm.hobby_id = h.hobby_id
      WHERE hm.user_id = @userId
    `);
  return result.recordset;
};

const removeHobbyMember = async (userId, hobbyId) => {
  const pool = await poolPromise;
  await pool.request()
    .input("userId", userId)
    .input("hobbyId", hobbyId)
    .query(`
      DELETE FROM hobby_members 
      WHERE user_id = @userId AND hobby_id = @hobbyId
    `);
};




module.exports = {
  fetchAllHobbies,
  fetchHobbyWithMembers,
  insertHobbyMember,
  fetchUserHobbies,
  removeHobbyMember
};
