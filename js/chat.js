const con = require("./db");
const path = require("path");
const allgood = require("./allgood.js");
let conn;
(async () => {
  conn = await con.getConnection();
})();

function chat(req, res) {
  if (allgood(req, res) == 0) {
    res.writeHead(302, {
      Location: "/login",
    });
    res.end();
  } else {
    if (req.headers["with"]) {
      res.sendFile(path.join(__dirname, "../public/html/chat.html"));
    } else {
      res.sendFile(path.join(__dirname, "../public/html/allchats.html"));
    }
  }
}

module.exports = chat;
