require("dotenv").config();
const fetch = require("node-fetch");

/**
 * Fetch facilities from OneMap for multiple queryNames
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radius - Search radius in meters (default 3000)
 * @param {string[]} queryNames - Array of theme query names to fetch
 * @returns {Promise<Array>} Array of facility objects
 */
exports.fetchNearbyThemeFacilities = async (lat, lng, radius = 3000, queryNames = []) => {
  try {
    // 1. Get OneMap access token
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

    // 2. Calculate bounding box (extents)
    const delta = radius / 111320;
    const extents = `${lat - delta},${lng - delta},${lat + delta},${lng + delta}`;

    const allResults = [];

    for (const queryName of queryNames) {
      const url = `https://www.onemap.gov.sg/api/public/themesvc/retrieveTheme?queryName=${queryName}&extents=${extents}`;
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
