var express = require("express");
const path = require("path");
const mariadb = require("mariadb");
const WebSocket = require("ws");
const http = require("http");
const fs = require("fs");
const url = require("url");
const crypto = require("crypto");

const pool = mariadb.createPool({
  host: "127.0.0.1",
  user: "pk",
  password: "pk",
  database: "insta",
  connectionLimit: 20,
});
var conn = pool.getConnection();
var app = express();
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const port = 8080;

const server = http.createServer(app);

// WEB SOCKETTTTTTTTTTTT
// Initialize a WebSocket server instance
const wss = new WebSocket.Server({ server });
function s(filePath) {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the file:", err);
      return;
    }
    ws.send(data);
  });
}
socs = {};
wss.on("connection", (ws, request) => {
  console.log("New client connected");
  const parsedUrl = url.parse(request.url, true);
  let path = parsedUrl.pathname;
  path = path.slice(1);
  console.log(path);
  // Message event handler
  socs[path] = ws;
  ws.on("message", (message) => {
    const parsedUrl = url.parse(request.url, true);
    let path = parsedUrl.pathname;
    path = path.slice(1);
    console.log(`Received from ${path} : ${message}`);
    socs[path].send(`Echo: ${message}`);
  });

  // Close event handler
  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

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
app.post("/register", async (req, res) => {
  //console.log(req);
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  try {
    let ok = 1;
    conn = await pool.getConnection();
    console.log(req.body);
    n = encodeURIComponent(req.body.username.trim());
    if (n.includes("%20")) {
      socs[n].send(
        JSON.stringify({ error: "username must not contain space" })
      );
      socs[n].close();
      delete socs[n];
      ok = 0;
    }
    let r= await conn.query(`select username from users where username = '${n}' `);
    if(r.length > 0){
      socs[n].send(
        JSON.stringify({ error: "username already taken" })
      );
      socs[n].close();
      delete socs[n];
      ok = 0;
    }
    delete r;
    e = req.body.email.trim();
    r= await conn.query(`select email from users where email = '${e}' `);
    if(r.length > 0){
      socs[n].send(
        JSON.stringify({ error: "An user with this email already exist" })
      );
      socs[n].close();
      delete socs[n];
      ok = 0;
    }
    delete r;
    if(!emailPattern.test(e)) {
      socs[n].send(
        JSON.stringify({ error: "invalid email" })
      );
      socs[n].close();
      delete socs[n];
      ok = 0;
    }
    if(req.body.password.length < 8){
      socs[n].send(
        JSON.stringify({ error: "password length must be at least 8" })
      );
      socs[n].close();
      delete socs[n];
      ok = 0;
    }
    p = crypto.createHash('sha256').update(req.body.password).digest("hex");
    console.log(ok)
    if(ok == 1){
      const query = `INSERT INTO users (username,email, password) VALUES ('${n}','${e}','${p}')`;
      const result = await conn.query(query);
      res.status(200).send('ok');
      //res.status(201).send(`Data inserted with ID: ${result.insertId}`);
      req.destroy();
      socs[n].send("Registered");
      console.log("registered");
    }
  } catch (err) {
    //res.status(500).send(`Error: ${err.message}`);
    console.log(err);
  } finally {
    console.log(".....")
  }
  //res.redirect('/login');
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
