const con = require("./db");
let conn;
let me;
let u;
(async () => {
	conn = await con.getConnection();
})();
async function follow(req, res) {
	u = req.headers["user"];
	async function doifollow() {
		const r = await conn.query(
			`select username from users where cookie='${
				req.headers.cookie.split("=")[1]
			}'`,
		);
		me = r[0]["username"];
		console.log("me " + me);
		const rr = await conn.query(
			`select * from ${me + "follow"} where user = '${u}' `,
		);
		if (!rr[0]) {
			return false;
		} else {
			return true;
		}
	}
	try {
		x = await doifollow();
		console.log("do i follow " + x);
		if (!x) {
			await conn.query(`insert into ${me + "follow"} values('${u}')`);
			res.send("yes");
		} else {
			await conn.query(`delete from ${me + "follow"} where user = '${u}'`);
			res.send("no");
		}
	} catch (err) {
		console.log(err);
	}
}
module.exports = follow;
