var express = require('express')
const path = require('path');
const mariadb = require('mariadb');
const WebSocket = require('ws');
const http = require('http');




const pool = mariadb.createPool({
  host: '127.0.0.1',
  user: 'pk',
  password: 'pk',
  database: 'insta',
  connectionLimit: 20
});

var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 8080


const server = http.createServer(app);

// Initialize a WebSocket server instance
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('New client connected');

    // Message event handler
    ws.on('message', (message) => {
        console.log(`Received: ${message}`);
        ws.send(`Echo: ${message}`);
    });

    // Close event handler
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});









app.use(express.static('public'))

app.get('/login', (req, res) => {
    res.sendFile(path.join(path.dirname(require.main.filename),"public/html/login.html"))
})
app.post('/login', async(req, res) => {
  console.log(req);
  let conn;
    try {
        conn = await pool.getConnection();
        const query = `INSERT INTO users (username,email, password) VALUES ('${req.body.userName}','${req.body.email}','${req.body.password}')`;        const result = await conn.query(query);
        res.status(201).send(`Data inserted with ID: ${result.insertId}`);
        console.log("registered");
    } catch (err) {
        res.status(500).send(`Error: ${err.message}`);
    } finally {
        if (conn) conn.end();
    }
  //res.redirect('/login');
})

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})