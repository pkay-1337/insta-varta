const con = require("./db");
const path = require("path");
var conn;
(async () => {conn = await con.getConnection();})();
async function home(req,res){
  if (!req.headers.cookie) {
    res.writeHead(302, {
      Location: "/login",
    });
    res.end();
  } else if (req.headers.cookie) {
    console.log("Logged in user");
    let cookie = req.headers.cookie.split("=")[1];
    let r = await conn.query(`select * from users where cookie = '${cookie}';`);
    if (!r[0]) {
      res.writeHead(302, {
        Location: "/login",
      });
      res.end();
    } else {
      let time = r[0]["time"];
      let after = BigInt(time);
      if (after < BigInt(String(Date.now()))) {
        //delete cookie
        console.log("here", after,Bigint(String(Date.now())) );

        await conn.query(
          `update users set cookie=Null, time=Null where cookie='${cookie}';`
        );
        res.writeHead(302, {
          Location: "/login",
        });
        res.end();
        return;
      } else {
        res.sendFile(path.join(__dirname, "/../public/html/home.html"));
      }
    }
  }
}
module.exports = home;

