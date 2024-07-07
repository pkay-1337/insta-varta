const con = require("./db");
let conn;
let me;
let u;
(async () => {
	conn = await con.getConnection();
})();
async function doifollow(req, res) {
	u = req.headers["user"];
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
		res.send("no");
	} else {
		res.send("yes");
	}
}
module.exports = doifollow;
