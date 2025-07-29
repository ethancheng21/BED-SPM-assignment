require('dotenv').config();
const fetch = require('node-fetch');

// This is the logic from onemapAuth.js — moved into controller properly
exports.getOneMapToken = async (req, res) => {
  const url = "https://www.onemap.gov.sg/api/auth/post/getToken";

  const body = {
    email: process.env.ONEMAP_EMAIL,
    password: process.env.ONEMAP_PASSWORD
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "OneMap auth failed" });
    }

    const data = await response.json();
    res.json({
      access_token: data.access_token,
      expiry_timestamp: data.expiry_timestamp
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
