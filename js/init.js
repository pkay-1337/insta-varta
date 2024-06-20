const con = require("./db");
var conn;
(async () => {
    conn = await con.getConnection();
})();
async function init(req, res) {
    try{
        if(req.headers['get']){
            let g = req.headers['get'];
            let r = await conn.query(`select ${g} from users where cookie='${req.headers.cookie.split("=")[1]}'`);
            res.send(r[0][g]);
        }else{
            if (!req.headers.cookie) {
                res.writeHead(302, {
                    Location: "/login",
                });
                res.end();
            } else if (req.headers.cookie) {
                let cookie = req.headers.cookie.split("=")[1];
                let r = await conn.query(`select * from users where cookie = '${cookie}';`);
                if (!r[0]) {
                    res.writeHead(302, {
                        Location: "/login",
                    });
                    res.end();
                } else {
                    let time = r[0]["time"];
                    let after = BigInt(time);
                    if (after < BigInt(String(Date.now()))) {
                        //delete cookie
                        console.log("here", after, BigInt(String(Date.now())));

                        await conn.query(
                            `update users set cookie=Null, time=Null where cookie='${cookie}';`
                        );
                        res.writeHead(302, {
                            Location: "/login",
                        });
                        res.end();
                        return;
                    } else {
                        res.writeHead(302, {
                            Location: "/home",
                        });
                        res.end();
                    }
                }
            }
        }
    }
    catch (err) { console.log(err); }
}
module.exports = init;
