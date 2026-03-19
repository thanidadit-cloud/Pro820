const db = require('../config/db');

exports.getAllProducts = async (res) => {
    const [rows] = await db.query('SELECT * FROM products ORDER BY id ASC');
    res.end(JSON.stringify(rows));
};

exports.getLowStock = async (res) => {
    const [rows] = await db.query('SELECT * FROM products WHERE quantity <= min_stock');
    res.end(JSON.stringify(rows));
};

exports.addProduct = async (res, data) => {
    const { name, quantity, min_stock } = data;
    const [result] = await db.execute(
        "INSERT INTO products (name, quantity, min_stock) VALUES (?, ?, ?)", 
        [name, quantity, min_stock]
    );
    res.end(JSON.stringify({ status: "success", message: "เพิ่มสำเร็จ!", id: result.insertId }));
};

exports.updateStock = async (res, data) => {
    const { product_id, type, amount } = data;
    const [checkProduct] = await db.execute("SELECT name, quantity FROM products WHERE id = ?", [product_id]);
    
    if (checkProduct.length === 0) {
        res.writeHead(404);
        return res.end(JSON.stringify({ status: "error", message: `ไม่พบสินค้า ID: ${product_id}` }));
    }

    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();
        const today = new Date().toLocaleDateString('en-CA'); 
        await conn.execute(
            "INSERT INTO stock_logs (product_id, type, amount, log_date) VALUES (?, ?, ?, ?)", 
            [product_id, type, amount, today]
        );
        const op = (type === 'IN') ? '+' : '-';
        await conn.execute(`UPDATE products SET quantity = quantity ${op} ? WHERE id = ?`, [amount, product_id]);
        await conn.commit();
        res.end(JSON.stringify({ status: "success", message: "บันทึกเรียบร้อย!" }));
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally { conn.release(); }
};