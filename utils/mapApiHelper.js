require("dotenv").config();
const fetch = require("node-fetch");

/**
 * Fetch facilities from OneMap for multiple queryNames
 */
exports.fetchNearbyThemeFacilities = async (lat, lng, radius = 3000, queryNames = [], noRadius = false) => {
  try {
    const tokenRes = await fetch("https://www.onemap.gov.sg/api/auth/post/getToken", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: process.env.ONEMAP_EMAIL,
        password: process.env.ONEMAP_PASSWORD
      })
    });

    const tokenData = await tokenRes.json();
    const token = tokenData.access_token;
    if (!token) throw new Error("❌ OneMap token fetch failed");

    // If 'noRadius' is true, don't apply the radius-based filtering
    let extents = '';
    if (!noRadius) {
      // Calculate bounding box for the given radius
      const delta = radius / 111320; // Approximation for 1 degree = 111,320 meters
      extents = `${lat - delta},${lng - delta},${lat + delta},${lng + delta}`;
    }

    const allResults = [];

    for (const queryName of queryNames) {
      let url = `https://www.onemap.gov.sg/api/public/themesvc/retrieveTheme?queryName=${queryName}`;
      
      if (extents) {
        // If not in 'noRadius' mode, add the 'extents' parameter
        url += `&extents=${extents}`;
      }
      
      console.log(`📡 Requesting OneMap Theme: ${queryName}`);
      console.log("🔗 URL:", url);

      const res = await fetch(url, {
        headers: { Authorization: token }
      });

      const data = await res.json();
      console.log("📦 OneMap response keys:", Object.keys(data));
      if (!data.SrchResults || !Array.isArray(data.SrchResults)) continue;

      const facilities = data.SrchResults
        .filter(f => typeof f.LatLng === "string" && f.LatLng.includes(","))
        .map(f => {
          try {
            const [latStr, lngStr] = f.LatLng.split(",");
            const parsedLat = parseFloat(latStr);
            const parsedLng = parseFloat(lngStr);

            if (isNaN(parsedLat) || isNaN(parsedLng)) {
              console.warn("⚠️ Skipped invalid coordinates:", f.LatLng);
              return null;
            }

            return {
              name: f.NAME || f.Theme_Name || "Unnamed",
              description: f.DESCRIPTION || "",
              lat: parsedLat,
              lng: parsedLng,
              address: f.ADDRESS || "",
              source: "onemap",
              category: queryName
            };
          } catch (e) {
            console.warn("⚠️ Skipped invalid coordinates:", f.LatLng);
            return null;
          }
        })
        .filter(Boolean);

      allResults.push(...facilities);
    }

    return allResults;

  } catch (err) {
    console.error("❌ Theme API error:", err.message);
    return [];
  }
};

/**
 * Fetch public transport route from OneMap API (PT mode)
 */
/**
 * Fetch public transport route from OneMap API (PT mode)
 */
exports.fetchPublicTransportRoute = async (startLat, startLng, endLat, endLng) => {
  try {
    // Fetch the token for OneMap API access
    const tokenRes = await fetch("https://www.onemap.gov.sg/api/auth/post/getToken", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: process.env.ONEMAP_EMAIL,
        password: process.env.ONEMAP_PASSWORD
      })
    });

    const tokenData = await tokenRes.json();
    const token = tokenData.access_token;
    if (!token) throw new Error("❌ OneMap token fetch failed");

    console.log("🪪 Token:", token);

    const now = new Date();
    const date = `${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}-${now.getFullYear()}`;
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:00`;

    // Construct the URL for OneMap's public transport route service
    const url = `https://www.onemap.gov.sg/api/public/routingsvc/route?start=${startLat},${startLng}&end=${endLat},${endLng}&routeType=pt&date=${date}&time=${time}&mode=TRANSIT&maxWalkDistance=1000&numItineraries=1`;

    console.log("🚇 Requesting route:", url);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Handle the response and ensure it's JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      throw new Error("Non-JSON response from OneMap: " + text.slice(0, 100));
    }

    // Parse the JSON data
    const data = await response.json();

    if (!response.ok || !data.plan) {
      console.error("❌ OneMap route error:", data);
      return {
        error: true,
        message: data.message || "No route plan available",
        raw: data
      };
    }

    console.log("✅ Route fetched successfully. # of itineraries:", data.plan.itineraries?.length || 0);

    return data;  // Return the fetched data for use in the frontend
  } catch (err) {
    console.error("❌ Error fetching public transport route:", err.message);
    return {
      error: true,
      message: err.message,
      raw: null
    };
  }
};