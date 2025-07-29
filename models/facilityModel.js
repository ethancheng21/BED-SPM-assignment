const { poolPromise } = require("../db");
const sql = require("mssql");

// Fetch nearby facilities using Haversine formula
const fetchNearbyFacilities = async (lat, lng, radius) => {
  const pool = await poolPromise;

  const query = `
    SELECT 
      facility_id, name, category, latitude, longitude, address,
      6371000 * ACOS(
        COS(RADIANS(@lat)) * COS(RADIANS(latitude)) * COS(RADIANS(longitude) - RADIANS(@lng)) +
        SIN(RADIANS(@lat)) * SIN(RADIANS(latitude))
      ) AS distance
    FROM facilities
    WHERE 
      6371000 * ACOS(
        COS(RADIANS(@lat)) * COS(RADIANS(latitude)) * COS(RADIANS(longitude) - RADIANS(@lng)) +
        SIN(RADIANS(@lat)) * SIN(RADIANS(latitude))
      ) <= @radius
    ORDER BY distance;
  `;

  const result = await pool
    .request()
    .input("lat", sql.Float, lat)
    .input("lng", sql.Float, lng)
    .input("radius", sql.Float, radius)
    .query(query);

  return result.recordset;
};

const createFacility = async (name, category, latitude, longitude, address) => {
  const pool = await poolPromise;
  return await pool
    .request()
    .input("name", sql.NVarChar, name)
    .input("category", sql.NVarChar, category)
    .input("latitude", sql.Float, latitude)
    .input("longitude", sql.Float, longitude)
    .input("address", sql.NVarChar, address)
    .query(`INSERT INTO facilities (name, category, latitude, longitude, address)
            VALUES (@name, @category, @latitude, @longitude, @address)`);
};

const updateFacility = async (id, name, category, latitude, longitude, address) => {
  const pool = await poolPromise;
  return await pool
    .request()
    .input("id", sql.Int, id)
    .input("name", sql.NVarChar, name)
    .input("category", sql.NVarChar, category)
    .input("latitude", sql.Float, latitude)
    .input("longitude", sql.Float, longitude)
    .input("address", sql.NVarChar, address)
    .query(`UPDATE facilities SET
              name = @name,
              category = @category,
              latitude = @latitude,
              longitude = @longitude,
              address = @address
            WHERE facility_id = @id`);
};

const deleteFacility = async (id) => {
  const pool = await poolPromise;
  return await pool
    .request()
    .input("id", sql.Int, id)
    .query("DELETE FROM facilities WHERE facility_id = @id");
};

module.exports = {
  fetchNearbyFacilities,
  createFacility,
  updateFacility,
  deleteFacility,
};
