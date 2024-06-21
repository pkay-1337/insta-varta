const con = require("./db");
const crypto = require("crypto");
//const {app, wss, socs, server} = require("./ws");
let conn;
function setCookie(name, value, days) {
	let expires = "";
	if (days) {
		const date = new Date();
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
		expires = "; expires=" + date.toUTCString();
	}
	return name + "=" + (value || "") + expires + "; path=/";
}
function createCookie() {
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let result = "";
	const charactersLength = characters.length;
	for (let i = 0; i < 32; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}
(async () => {
	conn = await con.getConnection();
})();
async function login(req, res) {
	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	let ok = 1;
	try {
		let e = req.body.username.trim();
		let p = req.body.password.trim();
		p = crypto.createHash("sha256").update(req.body.password).digest("hex");
		const x = emailPattern.test(e);
		console.log("is email : " + e + " " + x);
		if (x == true) {
			const query = `select email,password from users where email='${e}';`;
			const r = await conn.query(query);
			if (r.length < 1) {
				res.send(JSON.stringify({ error: "wrong email or password" }));
				ok = 0;
				return;
			} else {
				if (r[0]["password"] === p) {
					const c = createCookie();
					cookie = setCookie("session", c, 1 / 24);
					await conn.query(
						`update users set cookie = '${c}' where email='${e}';`,
					);
					console.log(Date.now());
					const later = String(Date.now() + 1000 * 60 * 60);
					await conn.query(
						`update users set time = '${later}' where email='${e}';`,
					);
					//res.setHeader('Set-Cookie', cookie);
					res.writeHead(302, {
						"Content-Type": "text/plain",
						"Set-Cookie": `${cookie}`,
						/* "Location":"/home"*/
					});
					res.end(JSON.stringify({ success: "Login Successful" }));
					return;
				} else {
					res.send(JSON.stringify({ error: "wrong email or password" }));
					ok = 0;
					return;
				}
			}
		} else {
			e = encodeURIComponent(req.body.username.trim());
			const query = `select username,password from users where binary username ='${e}';`;
			const r = await conn.query(query);
			if (r.length < 1) {
				res.writeHead(200, { "Content-Type": "text/plain" });
				res.end(JSON.stringify({ error: "wrong username or password" }));
				ok = 0;
				return;
			} else {
				if (r[0]["password"] === p) {
					const c = createCookie();
					cookie = setCookie("session", c, 1 / 24);
					await conn.query(
						`update users set cookie = '${c}' where username ='${e}';`,
					);
					const later = String(Date.now() + 60 * 60 * 1000);
					await conn.query(
						`update users set time = '${later}' where username='${e}';`,
					);
					//res.setHeader('Set-Cookie', cookie);
					res.writeHead(200, {
						"Content-Type": "text/plain",
						"Set-Cookie": `${cookie}`,
						/*"Location":"/home"*/
					});
					//res.end('ok');
					res.end(JSON.stringify({ success: "Login Successful" }));
					return;
				} else {
					res.send(JSON.stringify({ error: "wrong username or password" }));
					ok = 0;
					return;
				}
			}
		}
	} catch (err) {
		console.log(err);
	}
}
module.exports = { login };
