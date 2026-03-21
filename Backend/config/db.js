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

db.initDB = async () => {
    try {
        const connection = await db.getConnection();
        console.log(' MySQL Database connected successfully');
    } catch (err) {
        console.error(' Database connection failed:', err.message);
        throw err;
    }
};

module.exports = db;