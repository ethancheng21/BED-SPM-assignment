const { sql, poolPromise } = require("../db");

// REGISTER
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const pool = await poolPromise;
    if (!pool) throw new Error("Database connection failed.");

    await pool.request()
      .input("name", sql.VarChar(100), name)
      .input("email", sql.VarChar(100), email)
      .input("password", sql.VarChar(255), password)
      .query(`
        INSERT INTO users (name, email, password_hash)
        VALUES (@name, @email, @password)
      `);

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({
      message: "Registration error",
      error: err.message || "Unknown error",
      stack: err.stack
    });
  }
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const pool = await poolPromise;
    if (!pool) throw new Error("Database connection failed.");

    const result = await pool.request()
      .input("email", sql.VarChar(100), email)
      .input("password", sql.VarChar(255), password)
      .query(`
        SELECT * FROM users WHERE email = @email AND password_hash = @password
      `);

    const user = result.recordset[0];

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({ message: "Login success", userId: user.user_id });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      message: "Login error",
      error: err.message || "Unknown error",
      stack: err.stack
    });
  }
};

// VIEW PROFILE
exports.getProfile = async (req, res) => {
  const userId = req.userId;

  try {
    const pool = await poolPromise;
    if (!pool) throw new Error("Database connection failed.");

    const result = await pool.request()
      .input("userId", sql.Int, userId)
      .query(`SELECT user_id, name, email FROM users WHERE user_id = @userId`);

    const user = result.recordset[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({
      message: "Profile fetch error",
      error: err.message || "Unknown error",
      stack: err.stack
    });
  }
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  const userId = req.userId;
  const { name, email, password } = req.body;

  try {
    const pool = await poolPromise;
    if (!pool) throw new Error("Database connection failed.");

    await pool.request()
      .input("userId", sql.Int, userId)
      .input("name", sql.VarChar(100), name)
      .input("email", sql.VarChar(100), email)
      .input("password", sql.VarChar(255), password)
      .query(`
        UPDATE users
        SET name = @name, email = @email, password_hash = @password
        WHERE user_id = @userId
      `);

    res.json({ message: "Profile updated" });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({
      message: "Profile update error",
      error: err.message || "Unknown error",
      stack: err.stack
    });
  }
};
