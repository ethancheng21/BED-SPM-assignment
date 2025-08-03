const { fetchPublicTransportRoute } = require("../utils/mapApiHelper");

// In-memory route storage (mocked)
const savedRoutes = {}; // key = userId, value = array of routes

// GET /api/transport/route
exports.getPublicTransportRoute = async (req, res) => {
  const { startLat, startLng, endLat, endLng } = req.query;

  if (!startLat || !startLng || !endLat || !endLng) {
    return res.status(400).json({ message: "Missing coordinates" });
  }

  try {
    const route = await fetchPublicTransportRoute(startLat, startLng, endLat, endLng);
    res.json(route);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving route", error: err.message });
  }
};

// POST /api/transport/saveRoute
exports.saveRoute = (req, res) => {
  const userId = req.userId; // ✅ FIXED this line
  const route = req.body.route;

  if (!route) {
    return res.status(400).json({ message: "Missing route data" });
  }

  if (!savedRoutes[userId]) savedRoutes[userId] = [];
  savedRoutes[userId].push(route);

  res.status(200).json({
    message: "Route saved temporarily",
    savedCount: savedRoutes[userId].length
  });
};

// GET /api/transport/savedRoutes
exports.getSavedRoutes = (req, res) => {
  const userId = req.userId; // ✅ FIXED this line
  const userRoutes = savedRoutes[userId] || [];

  res.status(200).json({ routes: userRoutes });
};
