const con = require("./db");
const allgood = require("./allgood.js");
let conn;
(async () => {
  conn = await con.getConnection();
})();

async function chat(req, res) {
  if (allgood(req, res) == 0) {
    res.writeHead(302, {
      Location: "/login",
    });
    res.end();
  } else {
    let r = await conn.query(
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
      r = await conn.query(`select * from ${tablename};`);
      res.send(r);
    }
  }
}

module.exports = chat;
