const con = require("./db");
let conn;
(async () => {
	conn = await con.getConnection();
})();
function search(req, res) {
	const cookie = req.headers.cookie.split("=")[1];
	let name;
	let result;
	let x = [];
	(async () => {
		name = await conn.query(
			`select username from users where cookie='${cookie}'`,
		);
		name = name[0]["username"];
		//console.log(name);
		s = req.headers["search"];
		s = JSON.parse(s)["search"];
		s = s.split(" ");
		const s0 = `%${s[0]}%`;
		const s1 = `%${s[1]}%`;

		result = await conn.query(
			"SELECT username FROM users WHERE username LIKE ? OR username LIKE ?",
			[s0, s1],
		);
		/*
		result = await conn.query(
			`select username from  users where username like '%${
				s[0]
			}%' or username like '%${s[1]}%';`,
		);
		*/
		result.forEach((element) => {
			x.push(element);
		});
		x = JSON.stringify(x);
		res.send(x);
	})();
}

module.exports = search;
