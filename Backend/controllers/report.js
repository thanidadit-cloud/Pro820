const db = require('../config/db');

exports.getDailyReport = async (res) => {
    const [rows] = await db.query(`
        SELECT DATE_FORMAT(log_date, '%Y-%m-%d') AS date, type, CAST(SUM(amount) AS UNSIGNED) AS total 
        FROM stock_logs GROUP BY date, type ORDER BY date DESC
    `);
    res.end(JSON.stringify(rows));
};

exports.getMonthlyReport = async (res) => {
    const [rows] = await db.query(`
        SELECT DATE_FORMAT(log_date, '%Y-%m') AS date, type, CAST(SUM(amount) AS UNSIGNED) AS total 
        FROM stock_logs GROUP BY date, type ORDER BY date DESC
    `);
    res.end(JSON.stringify(rows));
};