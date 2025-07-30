const sql = require("mssql");

// Debug: Show loaded env variables (optional - remove for production)
console.log("Loaded DB config:", {
  user: process.env.DB_USER,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT
});

// SQL Server config
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT),
  options: {
    encrypt: false, // Use true if you're using Azure
    trustServerCertificate: true,
  },
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to MSSQL');
    return pool;
  })
  .catch(err => console.error('DB connection failed:', err));

module.exports = { sql, poolPromise };
