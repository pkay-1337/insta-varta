const con = require("./db");
const get = require("./getpage");
let conn;
(async () => {
	conn = await con.getConnection();
})();
function profile(req, res) {
	p = req.query["p"];
	if (!p) {
		get(req, res, "../public/html/profile.html");
	} else {
		console.log("a");
	}
}

module.exports = profile;
