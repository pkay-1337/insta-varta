const mariadb = require('mariadb');

async function testConnection() {
    const pool = mariadb.createPool({
        host: '127.0.0.1', 
        user: 'pk', 
        password: 'pk', 
        database: 'insta',
        connectionLimit: 5,
        connectTimeout: 10000
    });

    let conn;
    try {
        conn = await pool.getConnection();
        console.log('Connected to the database!');
    } catch (err) {
        console.error('Unable to connect to the database:', err.message);
    } finally {
        if (conn) conn.end();
    }
}

testConnection();