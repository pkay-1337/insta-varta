const con = require("./db");
const crypto = require("crypto");
const {app, wss, socs, server} = require("./ws");
var conn;
(async () => {conn = await con.getConnection();})();
async function register(req,res){
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  try {
    let ok = 1;
    console.log(req.body);
    n = encodeURIComponent(req.body.username.trim());
    if (n.includes("%20")) {
      socs[n].send(
        JSON.stringify({ error: "username must not contain space" })
      );
      ok = 0;
    }
    let r = await conn.query(`select username from users where username = '${n}' `);
    if(r.length > 0){
      socs[n].send(
        JSON.stringify({ error: "username already taken" })
      );
      ok = 0;
    }
    e = req.body.email.trim();
    r= await conn.query(`select email from users where email = '${e}' `);
    if(r.length > 0){
      socs[n].send(
        JSON.stringify({ error: "An user with this email already exist" })
      );
      ok = 0;
    }
    if(!emailPattern.test(e)) {
      socs[n].send(
        JSON.stringify({ error: "invalid email" })
      );
      ok = 0;
    }
    if(req.body.password.length < 8){
      //console.log(socs);
      socs[n].send(
        JSON.stringify({ error: "password length must be at least 8" })
      );
      ok = 0;
    }
    if(ok == 0){
      socs[n].close();
      delete socs[n];
    }
    p = crypto.createHash('sha256').update(req.body.password).digest("hex");
    console.log(ok)
    if(ok == 1){
      const query = `INSERT INTO users (username,email, password) VALUES ('${n}','${e}','${p}')`;
      const result = await conn.query(query);
      res.status(200).send('ok');
      //res.status(201).send(`Data inserted with ID: ${result.insertId}`);
      req.destroy();
      socs[n].send(JSON.stringify({"success":"Registered"}));
      console.log("registered");
    }
  } catch (err) {
    //res.status(500).send(`Error: ${err.message}`);
    console.log(err);
  } finally {
    console.log(".....")
  }
  //res.redirect('/login');
};
module.exports = {register};