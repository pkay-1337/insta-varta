const con = require("./db");
const allgood = require("./allgood.js");
const { socs } = require("./ws");
let conn;
(async () => {
	conn = await con.getConnection();
})();

async function startchat(req, res) {
	try {
		if (allgood(req, res) == 0) {
			res.writeHead(302, {
				Location: "/login",
			});
			res.end();
		} else {
			const r = await conn.query(
				`select username from users where cookie='${
					req.headers.cookie.split("=")[1]
				}'`,
			);
			if (r[0]["username"] == req.headers["sender"]) {
				sender = req.headers["sender"];
				reciever = req.headers["reciever"];
				message = req.headers["message"];
				let a;
				let b;
				if (sender.charCodeAt(0) > reciever.charCodeAt(0)) {
					a = reciever;
					b = sender;
				} else {
					b = reciever;
					a = sender;
				}
				tablename = a + "chat" + b;
				await conn.query(
					`INSERT INTO ${tablename} (time, sender, reciever, message) VALUES (?, ?, ?, ?)`,
					[String(Date.now()), sender, reciever, message],
				);
				/*
				await conn.query(
					`insert into ${tablename} (time, sender, reciever, message) values ('${
						String(
							Date.now(),
						)
					}', '${sender}', '${reciever}', '${message}')`,
				);
				*/
				if (socs[reciever]) {
					socs[reciever].send(
						JSON.stringify({ message: message, sender: sender }),
					);
				}
				res.send("ok");
			}
		}
	} catch (error) {
		console.log(error);
	}
}

module.exports = startchat;
