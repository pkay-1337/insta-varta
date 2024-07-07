const con = require("./db");
let conn;
(async () => {
	conn = await con.getConnection();
})();
async function photos(req, res) {
	const cookie = req.headers.cookie.split("=")[1];
	let name;
	name = await conn.query(
		`select username from users where cookie='${cookie}'`,
	);
	name = name[0]["username"];

	//console.log(name);
	follows = await conn.query(`select user from ${name + "follow"};`);
	console.log(follows);
	follows.push({ user: name });
	//	follows.forEach(async (element) => {
	let x = [];
	for (const element of follows) {
		u = element["user"];
		//console.log("user - " + u);
		r = await conn.query(`select * from ${u + "photo"};`);

		//r.forEach((el) => {
		for (const el of r) {
			//console.log("inner user - " + u);
			el["name"] = u;
			x.push(el);
		}
	}
	/*
	result = await conn.query(`select * from ${name + "photo"};`);
	result.forEach((element) => {
		element["name"] = name;
		x.push(element);
	});
	*/
	res.send(x);
}

module.exports = photos;
