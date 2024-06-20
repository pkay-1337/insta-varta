const path = require("path");
const reg = require("./js/register");
const log = require("./js/login");
const con = require("./js/db");
const init = require("./js/init");
const home = require("./js/home");
const get = require("./js/getpage");
const edit = require("./js/edit");
const { app, server } = require("./js/ws");
const fs = require("fs").promises;
const { exec } = require("child_process");
const { spawn } = require("child_process");

var conn;
(async () => {conn = await con.getConnection()})();



app.get("/", async (req, res) => { init(req, res)});
app.get("/login", (req, res, next) => { res.sendFile(path.join(__dirname, "public/html/login.html"))});
app.get("/home",(req,res) => { home(req,res) });
app.get("/profile",(req,res) => {get(req,res,"../public/html/profile.html")});
app.get("/edit",(req,res) => {get(req,res,"../public/html/edit.html")});
app.get("/profilePic",(req,res) => {get(req,res,'profile')});
app.post("/register", async (req, res) => reg.register(req, res));
app.post("/login", async (req, res) => log.login(req, res));
app.post("/edit",(req,res) => {edit(req,res)});



const port = 443;
server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
