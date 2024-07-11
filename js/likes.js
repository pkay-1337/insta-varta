const con = require("./db");
let conn;
let me;
let u;
(async () => {
  conn = await con.getConnection();
})();
async function likes(req, res) {
  p = req.headers["photo"];
  const r = await conn.query(
    `select username from users where cookie='${
      req.headers.cookie.split("=")[1]
    }'`,
  );
  me = r[0]["username"];
  console.log("me " + me);
  try {
    rrr = await conn.query(
      `select likes from users where binary binary username = '${me}'`,
    );
    rrr = rrr[0]["likes"];
    console.log(rrr);
    rrr = rrr.trim();
    res.send(rrr);
  } catch (err) {
    console.log(err);
  }
}
module.exports = likes;
