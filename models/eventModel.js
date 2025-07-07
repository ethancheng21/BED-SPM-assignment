const { sql, poolPromise } = require('../config/db');

async function getAllEvents() {
  const pool = await poolPromise;
  const result = await pool.request().query('SELECT * FROM events');
  return result.recordset;
}

module.exports = { getAllEvents };
