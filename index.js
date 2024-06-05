const path = require("path");
const reg = require('./js/register');
const log = require("./js/login");
const con = require("./js/db");
const {app, server} = require("./js/ws");
const fs = require('fs').promises;

async function getFile(x){
  const filePath = x;
  try {
      // Read the file contents
      const data = await fs.readFile(filePath, 'utf8');
      //console.log('File contents:', data);
      return data;
  } catch (err) {
      console.error('Error reading file:', err);
  }
}
conn = con.conn;

const port = 8080;
app.get("/", async (req, res) => {
  //res.sendFile(path.join(path.dirname(require.main.filename),"public/html/login.html"))
  //console.log(req.headers.path);
  if (!req.headers.cookie) {
    let p = req.headers['xyz'];
    console.log("path = " + p);
    if(!p) {
      x = await getFile("./index.html");
      res.send(x);
    }
    if(p == 'login'){
      x = await getFile("./public/html/login.html");
      //console.log(x);
      let d = JSON.stringify({'body': x})
      //console.log(d);
      res.send(d);
    }

    /*
    res.sendFile(
      path.join(path.dirname(require.main.filename), "public/html/login.html")
    );
    */
  }else if(req.headers.cookie){
    console.log("Logged in user");
    let p = req.headers['xyz'];
    console.log("path = " + p);
    if(!p) {
      x = await getFile("./index.html");
      res.send(x);
    }
    if(p == "home"){
      x = await getFile("./test.html");
      //console.log(x);
      let d = JSON.stringify({'body': x})
      //console.log(d);
      res.send(d);
    }
  }
  /*
  else{
    res.sendFile(
      path.join(path.dirname(require.main.filename), "index.html")
    );
  }
  */
  //console.log(req.headers);
});
app.post("/register", async (req,res) => reg.register(req,res));
app.post("/login", async (req,res) => log.login(req,res));
server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
