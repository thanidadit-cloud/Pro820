const db = require('../config/db');

exports.getAllProducts = async (res) => {
    try {
        const [rows] = await db.query('SELECT * FROM products ORDER BY id ASC');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(rows));
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: "error", message: err.message }));
    }
};


exports.getLowStock = async (res) => {
    try {
        const [rows] = await db.query('SELECT * FROM products WHERE quantity <= min_stock');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(rows));
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: "error", message: err.message }));
    }
};


exports.addProduct = async (res, data) => {
    try {
        const { name, quantity, min_stock } = data;
        const [result] = await db.execute(
            "INSERT INTO products (name, quantity, min_stock) VALUES (?, ?, ?)", 
            [name, quantity, min_stock || 5]
        );
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: "success", message: "เพิ่มสินค้าสำเร็จ!", id: result.insertId }));
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: "error", message: err.message }));
    }
};

//บันทึกการนำเข้า-จ่ายออก 
exports.updateStock = async (res, data) => {
    const { product_id, type, amount } = data;
    
    
    const [checkProduct] = await db.execute("SELECT name, quantity, min_stock FROM products WHERE id = ?", [product_id]);
    
    if (checkProduct.length === 0) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ status: "error", message: `ไม่พบสินค้า ID: ${product_id}` }));
    }

    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();
        
        
        const today = new Date().toISOString().split('T')[0]; 
        
        //บันทึกประวัติสต็อก
        await conn.execute(
            "INSERT INTO stock_logs (product_id, type, amount, log_date) VALUES (?, ?, ?, ?)", 
            [product_id, type, amount, today]
        );

        //คำนวณยอดใหม่
        const op = (type === 'IN') ? '+' : '-';
        await conn.execute(`UPDATE products SET quantity = quantity ${op} ? WHERE id = ?`, [amount, product_id]);

        //ดึงค่าล่าสุดหลังอัปเดตเพื่อส่งกลับไปให้หน้าบ้าน
        const [[updated]] = await conn.execute("SELECT quantity, min_stock FROM products WHERE id = ?", [product_id]);
        
        await conn.commit();

        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            status: "success", 
            message: "บันทึกเรียบร้อย!",
            currentQuantity: updated.quantity, // จำนวนคงเหลือปัจจุบัน
            lowStockAlert: updated.quantity <= updated.min_stock // ส่ง true ถ้าเหลือเท่ากับหรือน้อยกว่าเกณฑ์
        }));

    } catch (err) {
        if (conn) await conn.rollback();
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: "error", message: "เกิดข้อผิดพลาด: " + err.message }));
    } finally { 
        if (conn) conn.release(); 
    }
};