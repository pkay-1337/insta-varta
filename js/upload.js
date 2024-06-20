const multer = require('multer');
const path = require('path');
const fs = require('fs');
const con = require("./db");
var conn;
(async () => {conn = await con.getConnection();})();

var d;
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, "../uploads"));
    },
    filename: function(req, file, cb) {
        cb(null, d);
    }
});

// Init multer upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 2000000 } // Limit file size to 1MB
}).single('croppedImage');


// Handle POST request to '/edit'
function uploader(req,res){
    d = String(Date.now());
    if (!req.headers.cookie) {
        res.writeHead(302, {
            Location: "/login",
        });
        res.end();
        return;
    }
    let cookie = req.headers.cookie.split("=")[1];
    upload(req, res, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error uploading file.');
        }
        // Get bio text from the request body
        const caption = req.body.caption;

        let name;
        (async () => {
            name = await conn.query(`select username from users where cookie='${cookie}'`);
            name = name[0]['username'];
            console.log(name);
            await conn.query(`insert into ${name+'photo'} (photo, caption) values ('${d}', '${caption}')`)
        })();

        // Send response to client
        res.send("success");

    });
};

module.exports = uploader;