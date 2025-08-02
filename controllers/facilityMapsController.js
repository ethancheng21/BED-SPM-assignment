const fetch = require("node-fetch");
require("dotenv").config();

// Cleaned up list of supported OneMap themes (removed dfc_gtp)
const THEMES = [
  "moh_hospitals",
  "registered_pharmacy",
  "chas_clinics",
  "polyclinics",
  "nursing_homes",
  "eldercare_centres",
  "quitcentres",
  "blood_bank",
  "cervicalscreen",
  "breastscreen",
  "eldercare",
  "vaccination_polyclinics"
];

// Controller: Get all facilities from OneMap Theme API
exports.getFacilitiesFromOneMap = async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ message: "lat/lng required" });
  }

  try {
    // Authenticate with OneMap
    const tokenRes = await fetch("https://www.onemap.gov.sg/api/auth/post/getToken", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: process.env.ONEMAP_EMAIL,
        password: process.env.ONEMAP_PASSWORD,
      }),
    });

    const tokenData = await tokenRes.json();
    const token = tokenData.access_token;

    if (!token) {
      return res.status(500).json({ message: "Failed to authenticate with OneMap" });
    }

    const extents = "1.2000,103.6000,1.4800,104.0500";
    const allFacilities = [];

    // Concurrently fetch all themes using Promise.all
    const fetchPromises = THEMES.map(async (theme) => {
      const url = `https://www.onemap.gov.sg/api/public/themesvc/retrieveTheme?queryName=${theme}&extents=${extents}`;

      try {
        const response = await fetch(url, {
          headers: { Authorization: token },
        });

        const data = await response.json();
        if (!data?.SrchResults) return [];

        return data.SrchResults.map((facility) => {
          const coords = facility.LatLng?.split(",");
          if (!coords || coords.length !== 2) return null;

          const lat = parseFloat(coords[0]);
          const lng = parseFloat(coords[1]);
          if (isNaN(lat) || isNaN(lng)) return null;

          return {
            name: facility.NAME || "Unnamed",
            description: facility.DESCRIPTION || "",
            lat,
            lng,
            address: facility.ADDRESS || "",
            category: theme,
            source: "onemap",
          };
        }).filter(Boolean);
      } catch (e) {
        console.error(`❌ Error fetching theme ${theme}:`, e.message);
        return [];
      }
    });

    const facilitiesByTheme = await Promise.all(fetchPromises);
    facilitiesByTheme.forEach((themeFacilities) => allFacilities.push(...themeFacilities));

    if (allFacilities.length === 0) {
      return res.status(404).json({ message: "No facilities found." });
    }

    res.status(200).json({ count: allFacilities.length, results: allFacilities });
  } catch (err) {
    console.error("❌ Error fetching facilities:", err.message);
    res.status(500).json({ message: "Failed to fetch facilities" });
  }
};

// Controller: Get public transport route from user → facility
exports.getPublicTransportRoute = async (req, res) => {
  const { startLat, startLng, endLat, endLng } = req.query;

  if (!startLat || !startLng || !endLat || !endLng) {
    return res.status(400).json({ message: "Missing coordinates" });
  }

  try {
    const tokenRes = await fetch("https://www.onemap.gov.sg/api/auth/post/getToken", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: process.env.ONEMAP_EMAIL,
        password: process.env.ONEMAP_PASSWORD,
      }),
    });

    const tokenData = await tokenRes.json();
    const token = tokenData.access_token;

    if (!token) {
      return res.status(500).json({ message: "Failed to authenticate with OneMap" });
    }

    const now = new Date();
    const date = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const time = now.toTimeString().split(" ")[0]; // HH:MM:SS

    const routeUrl = `https://www.onemap.gov.sg/api/public/routingsvc/route?start=${startLat},${startLng}&end=${endLat},${endLng}&routeType=pt&date=${date}&time=${time}&mode=TRANSIT&maxWalkDistance=1000&numItineraries=1`;

    const response = await fetch(routeUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok || !data?.plan?.itineraries) {
      console.error("❌ Route error:", data);
      return res.status(404).json({ message: "No route found." });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error("❌ Error fetching transport route:", err.message);
    res.status(500).json({ message: "Failed to fetch transport route" });
  }
};
