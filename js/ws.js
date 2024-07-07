const https = require("https");
const fs = require("fs");
const url = require("url");
const express = require("express");
const WebSocket = require("ws");
const app = express();
app.use(express.json());
app.use(express.static("public/css"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const options = {
	key: fs.readFileSync("certs/key.pem"),
	cert: fs.readFileSync("certs/cert.pem"),
};
const server = https.createServer(options, app);

const wss = new WebSocket.Server({ server });
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
		socs[path].send(JSON.stringify({ success: "Message Recieved" }));
	});

	// Close event handler
	ws.on("close", () => {
		console.log("Client disconnected");
	});
});
module.exports = { app, wss, socs, server };
