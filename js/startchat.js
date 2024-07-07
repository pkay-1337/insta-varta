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
      if (r[0]["username"] == req.headers["sender"]) {
        sender = req.headers["sender"];
        reciever = req.headers["reciever"];
        let a;
        let b;
        if (sender.charCodeAt(0) > reciever.charCodeAt(0)) {
          a = reciever;
          b = sender;
        } else {
          b = reciever;
          a = sender;
        }
        tablename = a + "chat" + b;
        await conn.query(
          `create table if not exists ${tablename} (time varchar(15), sender varchar(20), reciever varchar(20), message varchar(200))`,
        );
        res.send("ok");
      }
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = startchat;
