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

    let r = await conn.query(
      "SELECT username FROM users WHERE binary username = ?",
      [n],
    );
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
