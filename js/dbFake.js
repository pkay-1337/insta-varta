const mariadb = require("mariadb");
const pool = mariadb.createPool({
  host: "",
  user: "",
  password: "",
  database: "",
  connectionLimit: 20,
});

let connection;

async function getConnection() {
  if (!connection) {
    connection = await pool.getConnection();
  }
  return connection;
}
module.exports = { getConnection };