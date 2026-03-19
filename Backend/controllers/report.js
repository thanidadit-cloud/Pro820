const db = require('../config/db');

exports.login = async (res, data) => {
    const { username, password } = data;
    try {
        // เช็คว่ามี user นี้และรหัสตรงกันไหม
        const [rows] = await db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);

        if (rows.length > 0) {
            res.end(JSON.stringify({ 
                status: "success", 
                message: "เข้าสู่ระบบสำเร็จ", 
                user: { name: rows[0].fullname } 
            }));
        } else {
            res.writeHead(401); // Unauthorized
            res.end(JSON.stringify({ status: "error", message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" }));
        }
    } catch (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ status: "error", message: err.message }));
    }
};