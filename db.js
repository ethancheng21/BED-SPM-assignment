const sql = require("mssql");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// SQL Server configuration
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT),
  options: {
    encrypt: false, // Use true if you're using Azure
    trustServerCertificate: true, // Disable for production
  },
};

// Create a connection pool
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log("Connected to MSSQL");
    return pool;
  })
  .catch(err => console.error("DB connection failed:", err));


// Define query function
async function query(sqlQuery, params = {}) {
  const pool = await poolPromise;
  const request = pool.request();

  // Bind parameters to the query
  for (const key in params) {
    request.input(key, params[key]);
  }

  // Execute the query
  const result = await request.query(sqlQuery);
  return result;
}

// Export query and poolPromise
module.exports = {
  sql,
  poolPromise,
  query, // Make sure query is exported
  request: async () => (await poolPromise).request(),
};

