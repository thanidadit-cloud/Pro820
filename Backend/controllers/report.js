const db = require('../config/db');

// ฟังก์ชันสำหรับรายงานรายวัน
exports.getDailyReport = async (res) => {
    try {
        const [rows] = await db.query(`
            SELECT DATE(log_date) as date, type, SUM(amount) as total 
            FROM stock_logs 
            GROUP BY DATE(log_date), type 
            ORDER BY date DESC
        `);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(rows));
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: "error", message: err.message }));
    }
};

// ฟังก์ชันสำหรับรายงานรายเดือน
exports.getMonthlyReport = async (res) => {
    try {
        const [rows] = await db.query(`
            SELECT DATE_FORMAT(log_date, '%Y-%m') as month, type, SUM(amount) as total 
            FROM stock_logs 
            GROUP BY month, type 
            ORDER BY month DESC
        `);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(rows));
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: "error", message: err.message }));
    }
};