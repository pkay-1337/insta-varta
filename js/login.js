const con = require("./db");
const crypto = require("crypto");
const {app, wss, socs, server} = require("./ws");
var conn;
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    return name + "=" + (value || "") + expires + "; path=/";
}
function createCookie(){
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 32; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
(async () => {conn = await con.getConnection();})();
async function login(req,res) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let ok = 1;
  try{
    let e = req.body.username.trim();
    let p = req.body.password.trim();
    p = crypto.createHash('sha256').update(req.body.password).digest("hex");
    let x = emailPattern.test(e);
    console.log("is email : "+ e + " " + x);
    if(x == true) {
        const query = `select email,password from users where email='${e}';`
        let r = await conn.query(query);
        if(r.length < 1){
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(JSON.stringify({'error':"failed"}));
            socs[e].send(
                JSON.stringify({ error: "wrong email or password" })
            );
            ok = 0;
        }
        if(r[0]['password'] == p) {
            console.log("socs going to : " + e);
            res.setHeader('Set-Cookie', cookie);
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(JSON.stringify({'success':"ok"}));
            socs[e].send(JSON.stringify({"success":"Login Successful"}));
        }else{
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(JSON.stringify({'error':"failed"}));
            socs[e].send(
                JSON.stringify({ error: "wrong email or password" })
            );
            ok = 0;
        }
    }else{

        e = encodeURIComponent(req.body.username.trim());
        const query = `select username,password from users where username ='${e}';`
        let r = await conn.query(query);
        if(r.length < 1){
            console.log("socs going to : " + e);
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(JSON.stringify({'error':"failed"}));
            socs[e].send(
                JSON.stringify({ error: "wrong username or password" })
            );
            ok = 0;
        }
        if(r[0]['password'] == p) {
            cookie = setCookie('session',createCookie(),7);
            res.setHeader('Set-Cookie', cookie);
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(JSON.stringify({'success':"ok"}));
            //res.end('ok');
            socs[e].send(JSON.stringify({"success":"Login Successful"}));
        }else{
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(JSON.stringify({'error':"failed"}));
            socs[e].send(
                JSON.stringify({ error: "wrong username or password" })
            );
            ok = 0;
        }
    }
    if(ok==0){
      socs[e].close();
      delete socs[e];
    };
  }catch(err){
    console.log(err);
  }
}
module.exports = {login}