const con = require("./db");
const crypto = require("crypto");
//const {app, wss, socs, server} = require("./ws");
var conn;
(async () => {conn = await con.getConnection();})();
async function register(req,res){
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  try {
    let ok = 1;
    console.log(req.body);
    n = encodeURIComponent(req.body.username.trim());
    e = req.body.email.trim();
    let r;
    (async () => {
      if (n.includes("%20")) {
        res.send(
          JSON.stringify({ error: "username must not contain space" })
        );
        ok = 0;
        return;
      }
      let r = await conn.query(`select username from users where username = '${n}' `);
      if(r.length > 0){
        res.send(
          JSON.stringify({ error: "username already taken" })
        );
        ok = 0;
        return;
      }
      if(emailPattern.test(e)){
        r= await conn.query(`select email from users where email = '${e}' `);
        if(r.length > 0){
          res.send(
            JSON.stringify({ error: "An user with this email already exist" })
          );
          ok = 0;
          return;
        }
      }
      if(!emailPattern.test(e)) {
        res.send(
          JSON.stringify({ error: "invalid email" })
        );
        ok = 0;
        return;
      }
      if(req.body.password.length < 8){
        //console.log(socs);
        res.send(
          JSON.stringify({ error: "password length must be at least 8" })
        );
        ok = 0;
        return;
      }
      if(ok==0) return;
      p = crypto.createHash('sha256').update(req.body.password).digest("hex");
      console.log(ok)
      const query = `INSERT INTO users (username,email, password) VALUES ('${n}','${e}','${p}')`;
      const result = await conn.query(query);
      await conn.query(`create table ${n+'photo'}(photo varchar(20),caption varchar(200));`);
      res.status(200).send(JSON.stringify({"success":"Registered"}));
      console.log("registered");

    })();
    /*
    if(ok == 0){
      res.close();
      delete socs[n];
    }
      */
  } catch (err) {
    //res.status(500).send(`Error: ${err.message}`);
    console.log(err);
  } finally {
    console.log(".....")
  }
  //res.redirect('/login');
};
module.exports = {register};