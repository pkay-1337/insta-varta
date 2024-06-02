const path = require("path");

const reg = require('./js/register');

const con = require("./js/db");

const {app, server} = require("./js/ws");
conn = con.conn;

const port = 8080;
app.get("/", (req, res) => {
  //res.sendFile(path.join(path.dirname(require.main.filename),"public/html/login.html"))
  if (!req.headers.cookie) {
    res.sendFile(
      path.join(path.dirname(require.main.filename), "public/html/login.html")
    );
    //s(path.join(path.dirname(require.main.filename), "public/html/login.html"));
  }
  //console.log(req.headers);
});
app.post("/register", async (req,res) => reg.register(req,res));

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
