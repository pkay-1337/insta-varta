var express = require("express");
const path = require("path");
const mariadb = require("mariadb");
const WebSocket = require("ws");
const http = require("http");
const fs = require("fs");
const url = require('url');


const pool = mariadb.createPool({
  host: "127.0.0.1",
  user: "pk",
  password: "pk",
  database: "insta",
  connectionLimit: 20,
});

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
wss.on("connection", (ws,request) => {
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
    res.sendFile(path.join(path.dirname(require.main.filename), "public/html/login.html"));
    //s(path.join(path.dirname(require.main.filename), "public/html/login.html"));
  }
  //console.log(req.headers);
});
app.post("/register", async (req, res) => {
  //console.log(req);
  let conn;
  try {
    conn = await pool.getConnection();
    console.log(req.body);
    n = req.body.username;
    const query = `INSERT INTO users (username,email, password) VALUES ('${req.body.username}','${req.body.email}','${req.body.password}')`;
    const result = await conn.query(query);
    //res.status(200).send();
    //res.status(201).send(`Data inserted with ID: ${result.insertId}`);
    req.destroy();
    socs[n].send("Registered");
    console.log("registered");
  } catch (err) {
    //res.status(500).send(`Error: ${err.message}`);
  } finally {
    if (conn) conn.end();
  }
  //res.redirect('/login');
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
