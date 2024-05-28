var express = require('express')
const path = require('path');

const mariadb = require('mariadb');


const pool = mariadb.createPool({
  host: 'localhost',
  user: 'pk',
  password: 'pk',
  database: 'insta',
  connectionLimit: 20
});

var app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 8080

app.use(express.static('public'))

app.get('/login', (req, res) => {
    console.log(path.join(path.dirname(require.main.filename)))
    res.sendFile(path.join(path.dirname(require.main.filename),"public/html/login.html"))
})
app.post('/login', (req, res) => {
  console.log(req);
  res.redirect('/login');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})