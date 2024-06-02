const mariadb = require("mariadb");
const pool = mariadb.createPool({
  host: "127.0.0.1",
  user: "pk",
  password: "pk",
  database: "insta",
  connectionLimit: 20,
});

let connection;

async function getConnection() {
  if (!connection) {
    connection = await pool.getConnection();
  }
  return connection;
}
module.exports = { getConnection};