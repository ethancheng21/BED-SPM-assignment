const {
  fetchNearbyFacilities,
  createFacility,
  updateFacility,
  deleteFacility
} = require("../models/facilityModel");

// Haversine distance formula
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// GET - Nearby facilities by lat/lng
exports.getNearbyFacilities = async (req, res) => {
  const { lat, lng, maxDistance } = req.query;

  if (!lat || !lng || !maxDistance) {
    return res.status(400).json({ message: "Please provide lat, lng, and maxDistance" });
  }

  try {
    const facilities = await fetchNearbyFacilities();
    const nearby = facilities.filter(facility => {
      const distance = getDistance(
        parseFloat(lat),
        parseFloat(lng),
        facility.latitude,
        facility.longitude
      );
      return distance <= parseFloat(maxDistance);
    });

    res.status(200).json(nearby);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching nearby facilities" });
  }
};

// POST
exports.createFacility = async (req, res) => {
  const { name, category, latitude, longitude, address } = req.body;
  if (!name || !category || !latitude || !longitude || !address) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    await createFacility(name, category, latitude, longitude, address);
    res.status(201).json({ message: "Facility created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating facility" });
  }
};

// PUT
exports.updateFacility = async (req, res) => {
  const { id } = req.params;
  const { name, category, latitude, longitude, address } = req.body;
  if (!name || !category || !latitude || !longitude || !address) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await updateFacility(id, name, category, latitude, longitude, address);
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Facility not found" });
    }
    res.status(200).json({ message: "Facility updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating facility" });
  }
};

// DELETE
exports.deleteFacility = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await deleteFacility(id);
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Facility not found" });
    }
    res.status(200).json({ message: "Facility deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting facility" });
  }
};
