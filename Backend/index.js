const http = require('http');
const url = require('url');
const apiRoutes = require('./routes/api');
// สมมติว่าไฟล์ db.js ของคุณส่งออกฟังก์ชันสำหรับเชื่อมต่อฐานข้อมูล
const { initDB } = require('./config/db'); 

const getBody = (req) => new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
        try {
            resolve(body ? JSON.parse(body) : {});
        } catch (e) {
            resolve({}); // ป้องกัน Error ถ้าส่ง JSON มาผิดรูปแบบ
        }
    });
});

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    
    // ตั้งค่า CORS
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') { 
        res.writeHead(204); 
        res.end(); 
        return; 
    }

    try {
        const bodyData = (req.method === 'POST') ? await getBody(req) : null;
        await apiRoutes(parsedUrl.pathname, req.method, req, res, bodyData);
    } catch (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ status: "error", message: err.message }));
    }
});

// ฟังก์ชันสำหรับเริ่มต้นระบบ (เหมือนแบบที่คุณอยากได้)
const startServer = async () => {
    try {
        console.log('Connecting to database...');
        // เรียกใช้ฟังก์ชันเชื่อมต่อ DB (ถ้าใน db.js ของคุณชื่ออื่น ให้เปลี่ยนตามนะครับ)
        const PORT = 8000;
        server.listen(PORT, () => {
            console.log(` Server is running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error(' Could not start server:', error.message);
        process.exit(1); 
    }
};

startServer();