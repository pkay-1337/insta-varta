const http = require("http");
const fs = require("fs");
const url = require("url");
var express = require("express");
const WebSocket = require("ws");
var app = express();
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));


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
  //console.log(path);
  // Message event handler
  socs[path] = ws;
  console.log("socs path : " + path);
  ws.on("message", (message) => {
    const parsedUrl = url.parse(request.url, true);
    let path = parsedUrl.pathname;
    path = path.slice(1);
    console.log(`Received from ${path} : ${message}`);
    //socs[path].send(`${message}`);
    socs[path].send(JSON.stringify({"success":"Message Recieved"}));
  });

  // Close event handler
  ws.on("close", () => {
    console.log("Client disconnected");
  });
});
module.exports = {app, wss, socs, server}