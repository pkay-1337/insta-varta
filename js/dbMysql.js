const mysql = require("mysql2/promise"); // Use mysql2 and promise-based API

const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "pk",
  password: "pk",
  database: "insta",
  waitForConnections: true,
  connectionLimit: 1000,
  queueLimit: 0,
});

let connection;

async function getConnection() {
  if (!connection) {
    connection = await pool.getConnection();
  }
  return connection;
}

module.exports = { getConnection };
