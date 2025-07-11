const sql = require("mssql");

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT),
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

// Create and connect pool
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log("✅ Connected to MSSQL");
    return pool;
  })
  .catch(err => {
    console.error("❌ DB connection failed:", err.message);
    return null;
  });

// Common helper to run queries with parameters (for medication.js)
async function query(sqlQuery, params = {}) {
  const pool = await poolPromise;
  const request = pool.request();
  for (const key in params) {
    request.input(key, params[key]);
  }
  return request.query(sqlQuery);
}

// Export
module.exports = {
  sql,
  poolPromise,
  query,
  request: async () => (await poolPromise).request(),
};
