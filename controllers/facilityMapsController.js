const fetch = require("node-fetch");
require("dotenv").config();

// Controller: Get all facilities (from OneMap Theme API)
exports.getFacilitiesFromOneMap = async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ message: "lat/lng required" });
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

    const extents = "1.2000,103.6000,1.4800,104.0500";
    const url = `https://www.onemap.gov.sg/api/public/themesvc/retrieveTheme?queryName=moh_hospitals&extents=${extents}`;

    const response = await fetch(url, {
      headers: { Authorization: token },
    });

    const data = await response.json();

    if (!data?.SrchResults) {
      return res.status(404).json({ message: "No facilities found." });
    }

    const facilities = data.SrchResults.map((facility) => {
      const coords = facility.LatLng?.split(",");
      if (!coords || coords.length !== 2) return null;

      return {
        name: facility.NAME || "Unnamed",
        description: facility.DESCRIPTION || "",
        lat: parseFloat(coords[0]),
        lng: parseFloat(coords[1]),
        address: facility.ADDRESS || "",
        category: facility.queryName || "moh_hospitals",
        source: "onemap",
      };
    }).filter(Boolean);

    res.status(200).json({ count: facilities.length, results: facilities });
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

    // Use current date and time
    const now = new Date();
    const date = now.toLocaleDateString("en-US", {
      year: "numeric", month: "2-digit", day: "2-digit"
    }).replace(/\//g, "-");

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
