const db = require('../config/db');

exports.login = async (res, data) => {
    const { username, password } = data;

    // เช็คข้อมูลเบื้องต้น
    if (!username || !password) {
        res.writeHead(400);
        return res.end(JSON.stringify({ success: false, message: "กรุณากรอกข้อมูลให้ครบ" }));
    }

    try {
        const [rows] = await db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);

        if (rows.length > 0) {
            // ✅ ต้องส่งรูปแบบนี้เท่านั้น Frontend ถึงจะยอมให้ผ่าน
            res.end(JSON.stringify({ 
                success: true, 
                message: "เข้าสู่ระบบสำเร็จ", 
                name: rows[0].fullname 
            }));
        } else {
            res.writeHead(401);
            res.end(JSON.stringify({ success: false, message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" }));
        }
    } catch (error) {
        res.writeHead(500);
        res.end(JSON.stringify({ success: false, message: "Database Error" }));
    }
};