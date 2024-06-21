const con = require("./db");
let conn;
(async () => {
	conn = await con.getConnection();
})();
function getphotos(req, res, who) {
	if (who == "$") {
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
			result = await conn.query(`select * from ${name + "photo"};`);
			result.forEach((element) => {
				element["name"] = name;
				x.push(element);
			});
			x = JSON.stringify(x);
			res.send(x);
		})();
	}
}

module.exports = getphotos;
