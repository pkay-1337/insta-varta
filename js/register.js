/*
const con = require("./db");
const crypto = require("crypto");
//const {app, wss, socs, server} = require("./ws");
let conn;
(async () => {
	conn = await con.getConnection();
})();
function register(req, res) {
	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	try {
		let ok = 1;
		console.log(req.body);
		n = encodeURIComponent(req.body.username.trim());
		e = req.body.email.trim();
		(async () => {
			if (n.includes("%20")) {
				res.send(JSON.stringify({ error: "username must not contain space" }));
				ok = 0;
				return;
			}
			if (n.length > 20) {
				res.send(
					JSON.stringify({ error: "username must not be longer than 20" }),
				);
				ok = 0;
				return;
			}
			let r = await conn.query(
				`select username from users where username = '${n}' `,
			);
			if (r.length > 0) {
				res.send(JSON.stringify({ error: "username already taken" }));
				ok = 0;
				return;
			}
			if (emailPattern.test(e)) {
				r = await conn.query(`select email from users where email = '${e}' `);
				if (r.length > 0) {
					res.send(
						JSON.stringify({ error: "An user with this email already exist" }),
					);
					ok = 0;
					return;
				}
			}
			if (!emailPattern.test(e)) {
				res.send(JSON.stringify({ error: "invalid email" }));
				ok = 0;
				return;
			}
			if (req.body.password.length < 8) {
				//console.log(socs);
				res.send(
					JSON.stringify({ error: "password length must be at least 8" }),
				);
				ok = 0;
				return;
			}
			if (ok == 0) return;
			p = crypto.createHash("sha256").update(req.body.password).digest("hex");
			console.log(ok);
			const query =
				`INSERT INTO users (username,email, password) VALUES ('${n}','${e}','${p}')`;
			await conn.query(query);
			await conn.query(
				`create table ${n + "photo"}(photo varchar(20),caption varchar(200));`,
			);
			await conn.query(`create table ${n + "follow"}(user varchar(30));`);
			res.status(200).send(JSON.stringify({ success: "Registered" }));
			console.log("registered");
		})();
		/**
    if(ok == 0){
      res.close();
      delete socs[n];
    }
      * /
	} catch (err) {
		//res.status(500).send(`Error: ${err.message}`);
		console.log(err);
	} finally {
		console.log(".....");
	}
	//res.redirect('/login');
}
module.exports = { register };
*/
const con = require("./db");
const bcrypt = require("bcrypt");

let conn;
(async () => {
	conn = await con.getConnection();
})();

async function register(req, res) {
	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	try {
		const n = encodeURIComponent(req.body.username.trim());
		const e = req.body.email.trim();

		if (n.includes("%20") || n.length > 20) {
			return res.status(400).json({ error: "Invalid username" });
		}

		if (!emailPattern.test(e)) {
			return res.status(400).json({ error: "Invalid email" });
		}

		if (req.body.password.length < 8) {
			return res.status(400).json({ error: "Password too short" });
		}

		let r = await conn.query("SELECT username FROM users WHERE username = ?", [
			n,
		]);
		if (r.length > 0) {
			return res.status(400).json({ error: "Username already taken" });
		}

		r = await conn.query("SELECT email FROM users WHERE email = ?", [e]);
		if (r.length > 0) {
			return res
				.status(400)
				.json({ error: "An user with this email already exists" });
		}

		const saltRounds = 10;
		const p = await bcrypt.hash(req.body.password, saltRounds);

		await conn.query(
			"INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
			[n, e, p],
		);
		np = n + "photo";
		await conn.query(
			`CREATE TABLE ${np} (photo VARCHAR(20), caption VARCHAR(200))`,
		);
		nf = n + "follow";
		await conn.query(`CREATE TABLE ${nf} (user VARCHAR(30))`);

		res.status(200).json({ success: "Registered" });
		console.log("Registered:", n);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "An error occurred during registration" });
	}
}

module.exports = { register };
