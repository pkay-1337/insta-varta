const con = require("./db");
let conn;
(async () => {
  conn = await con.getConnection();
})();
async function allgood(req, res) {
  if (!req.headers.cookie) {
    return 0;
  } else if (req.headers.cookie) {
    const cookie = req.headers.cookie.split("=")[1];
    const r = await conn.query(
      `select * from users where cookie = '${cookie}';`,
    );
    if (!r[0]) {
      return 0;
    } else {
      const time = r[0]["time"];
      const after = BigInt(time);
      if (after < BigInt(String(Date.now()))) {
        //delete cookie
        console.log("here", after, BigInt(String(Date.now())));

        await conn.query(
          `update users set cookie=Null, time=Null where cookie='${cookie}';`,
        );
        return 0;
      } else {
        return 1;
      }
    }
  }
}
module.exports = allgood;
