const http = require('http');
const url = require('url');
const apiRoutes = require('./routes/api');

const getBody = (req) => new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => resolve(body ? JSON.parse(body) : {}));
});

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    
    // ตั้งค่า CORS
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

    try {
        const bodyData = (req.method === 'POST') ? await getBody(req) : null;
        await apiRoutes(parsedUrl.pathname, req.method, req, res, bodyData);
    } catch (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ status: "error", message: err.message }));
    }
});

server.listen(3000, () => console.log(' Server is running at http://localhost:3000'));