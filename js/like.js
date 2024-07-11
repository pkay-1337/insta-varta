const con = require("./db");
let conn;
let me;
let u;
(async () => {
  conn = await con.getConnection();
})();
async function like(req, res) {
  p = req.headers["photo"];
  const r = await conn.query(
    `select username from users where cookie='${
      req.headers.cookie.split("=")[1]
    }'`,
  );
  me = r[0]["username"];
  console.log("me " + me);
  async function doilike() {
    const rr = await conn.query(
      `select likes from users where binary username = '${me}' `,
    );
    l = rr[0]["likes"];
    console.log(l);
    if (l.search(p) != -1) {
      return true;
    } else {
      return false;
    }
  }
  try {
    x = await doilike();
    console.log("do i like : " + x);
    if (!x) {
      await conn.query(
        `update users set likes = CONCAT(likes, " ${p}") where binary username = '${me}';`,
      );
      //await conn.query(`insert into ${me + "follow"} values('${u}')`);
      res.send("yes");
    } else {
      rrr = await conn.query(
        `select likes from users where binary username = '${me}'`,
      );
      rrr = rrr[0]["likes"];
      console.log(rrr);
      rrr = rrr.replaceAll(p, "");
      rrr = rrr.trim();
      await conn.query(
        `update users set likes = "${rrr}" where binary username = '${me}';`,
      );
      res.send("no");
    }
  } catch (err) {
    console.log(err);
  }
}
module.exports = like;
