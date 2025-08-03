const jwt = require("jsonwebtoken");

function authenticateJWT(req, res, next) {
  const authHeader = req.headers["authorization"];
  console.log("🔐 Incoming auth header:", authHeader); // ✅ Debug

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.warn("⛔ Missing or invalid token format");
    return res.status(401).json({ message: "Missing or invalid token" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("❌ JWT verification failed:", err.message); // ✅ Debug
      return res.status(403).json({ message: "Invalid token" });
    }

    console.log("✅ JWT verified. Payload:", decoded); // ✅ Debug
    req.userId = decoded.userId;
    next();
  });
}

module.exports = { authenticateJWT };
