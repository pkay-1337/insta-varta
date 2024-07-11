const con = require("./db");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
let conn;

function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  return `${name}=${value}; expires=${date.toUTCString()}; path=/; Secure; SameSite=Strict`;
}

function createCookie() {
  return crypto.randomBytes(16).toString("hex");
}

(async () => {
  conn = await con.getConnection();
})();

async function login(req, res) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  try {
    const identifier = req.body.username.trim();
    const password = req.body.password.trim();

    let query, params;
    if (emailPattern.test(identifier)) {
      query = "SELECT email, password FROM users WHERE email = ?";
      params = [identifier];
    } else {
      query = "SELECT username, password FROM users WHERE BINARY username = ?";
      params = [identifier];
    }

    const [user] = await conn.query(query, params);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const sessionToken = createCookie();
    const cookie = setCookie("session", sessionToken, 1 / 24);

    const expirationTime = Date.now() + 60 * 60 * 1000; // 1 hour from now

    where = emailPattern.test(identifier) ? "email" : "username";
    await conn.query(
      `UPDATE users SET cookie = ?, time = ? WHERE BINARY ${where} = ?`,
      [sessionToken, expirationTime, identifier],
    );

    res.setHeader("Set-Cookie", cookie);
    res.json({ success: "Login Successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred during login" });
  }
}

module.exports = { login };
