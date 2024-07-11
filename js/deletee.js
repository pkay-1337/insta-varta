const con = require("./db");
const fs = require("fs");
const path = require("path");

let conn;
let me;
let u;
(async () => {
  conn = await con.getConnection();
})();
async function deletee(req, res) {
  p = req.headers["photo"];
  u = req.headers["user"];
  const r = await conn.query(
    `select username from users where cookie='${
      req.headers.cookie.split("=")[1]
    }'`,
  );
  me = r[0]["username"];

  const rr = await conn.query(
    `select photo from ${u}photo where photo = '${p}'`,
  );
  if ((me == "Admin") | (me == u)) {
    if (rr[0]) {
      await conn.query(`delete from ${u}photo where photo = '${p}'`);
      const filePath = path.join(__dirname, "/../uploads/", p);
      console.log(filePath);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
          res.send("no");
          return;
        }
        console.log("File deleted successfully");
      });
      res.send("ok");
    }
  }
}
module.exports = deletee;
