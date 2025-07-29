const { fetchPublicTransportRoute } = require("../utils/mapApiHelper");

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
