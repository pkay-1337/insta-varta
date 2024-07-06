const con = require("./db");
const allgood = require("./allgood.js");
let conn;
(async () => {
  conn = await con.getConnection();
})();

async function startchat(req, res) {
  try {
    if (allgood(req, res) == 0) {
      res.writeHead(302, {
        Location: "/login",
      });
      res.end();
    } else {
      const r = await conn.query(
        `select username from users where cookie='${
          req.headers.cookie.split("=")[1]
        }'`,
      );
      if (r[0]) {
        u = r[0]["username"];
        query =
          `SELECT table_name FROM information_schema.tables WHERE table_schema = 'insta' AND (table_name LIKE '%chat${u}' OR table_name LIKE '${u}chat%')`;
        x = await conn.query(query);
        const y = [];
        l = x.length;
        for (i = 0; i < l; i++) {
          n = x[i]["table_name"];
          a = n.split("chat");
          y.push(a[0] == u ? a[1] : a[0]);
        }
        console.log(y);
        res.send(y);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = startchat;
