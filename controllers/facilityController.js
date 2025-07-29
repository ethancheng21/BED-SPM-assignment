const {
  fetchNearbyFacilities,
  createFacility: createFacilityModel,
  updateFacility: updateFacilityModel,
  deleteFacility: deleteFacilityModel
} = require("../models/facilityModel");

const { fetchNearbyThemeFacilities } = require("../utils/mapApiHelper");

// ✅ GET - Combined (OneMap + DB)
exports.getCombinedFacilities = async (req, res) => {
  const { lat, lng, radius = 3000 } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ message: "lat/lng required" });
  }

  try {
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    const radiusNum = parseFloat(radius);

    const [onemapFacilities, dbFacilities] = await Promise.all([
      fetchNearbyThemeFacilities(latNum, lngNum, radiusNum, ["moh_hospitals", "registered_pharmacy"]),
      fetchNearbyFacilities(latNum, lngNum, radiusNum)
    ]);

    const formattedDb = dbFacilities.map(f => ({
      name: f.name || "Unnamed",
      description: "",
      lat: parseFloat(f.latitude),
      lng: parseFloat(f.longitude),
      address: f.address || "",
      source: "database",
      category: f.category || "unspecified",
      distance: f.distance
    }));

    const combined = [...onemapFacilities, ...formattedDb];
    res.status(200).json({ count: combined.length, results: combined });

  } catch (err) {
    console.error("❌ Error in getCombinedFacilities:", err);
    res.status(500).json({ message: "Failed to fetch combined facilities" });
  }
};

// ✅ POST - Create facility
exports.createFacility = async (req, res) => {
  const { name, category, latitude, longitude, address } = req.body;

  if (!name || !category || !latitude || !longitude || !address) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    await createFacilityModel(name, category, latitude, longitude, address);
    res.status(201).json({ message: "Facility created successfully" });
  } catch (err) {
    console.error("❌ Error creating facility:", err);
    res.status(500).json({ message: "Error creating facility" });
  }
};

// ✅ PUT - Update facility
exports.updateFacility = async (req, res) => {
  const { id } = req.params;
  const { name, category, latitude, longitude, address } = req.body;

  if (!name || !category || !latitude || !longitude || !address) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await updateFacilityModel(id, name, category, latitude, longitude, address);
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Facility not found" });
    }
    res.status(200).json({ message: "Facility updated successfully" });
  } catch (err) {
    console.error("❌ Error updating facility:", err);
    res.status(500).json({ message: "Error updating facility" });
  }
};

// ✅ DELETE - Remove facility
exports.deleteFacility = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await deleteFacilityModel(id);
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Facility not found" });
    }
    res.status(200).json({ message: "Facility deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting facility:", err);
    res.status(500).json({ message: "Error deleting facility" });
  }
};
