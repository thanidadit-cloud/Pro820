const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'webdb',
    port: 8820,
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = db;