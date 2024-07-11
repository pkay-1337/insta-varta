const con = require("./db");
const path = require("path");
let conn;
(async () => {
  conn = await con.getConnection();
})();
async function get(req, res, p) {
  if (!req.headers.cookie) {
    res.writeHead(302, {
      Location: "/login",
    });
    res.end();
  } else if (req.headers.cookie) {
    //console.log("Logged in user");
    const cookie = req.headers.cookie.split("=")[1];
    let r = await conn.query(`select * from users where cookie = '${cookie}';`);
    if (!r[0]) {
      res.writeHead(302, {
        Location: "/login",
      });
      res.end();
    } else {
      const time = r[0]["time"];
      const after = BigInt(time);
      if (after < BigInt(String(Date.now()))) {
        //delete cookie
        console.log("hereeee", after, Bigint(String(Date.now())));

        await conn.query(
          `update users set cookie=Null, time=Null where cookie='${cookie}';`,
        );
        res.writeHead(302, {
          Location: "/login",
        });
        res.end();
        return;
      } else {
        if (p == "profile") {
          user = req.query["p"];
          console.log("here", user);
          if (user) {
            r = await conn.query(
              `select * from users where binary username = '${user}';`,
            );
            console.log(r[0]["profile"]);
            if (r[0]["profile"]) {
              res.sendFile(
                path.join(__dirname, "../uploads/" + r[0]["profile"]),
              );
            } else {
              res.sendFile(path.join(__dirname, "../uploads/1720701364274"));
            }
            //res.sendFile(path.join(__dirname, "../uploads/" + r[0]["profile"]));
          } else {
            console.log(r[0]["profile"]);
            if (r[0]["profile"]) {
              res.sendFile(
                path.join(__dirname, "../uploads/" + r[0]["profile"]),
              );
            } else {
              res.sendFile(path.join(__dirname, "../uploads/1720701364274"));
            }
          }
        } else {
          res.sendFile(path.join(__dirname, p));
        }
      }
    }
  }
}
module.exports = get;
