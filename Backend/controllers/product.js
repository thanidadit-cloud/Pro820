const db = require('../config/db');

exports.getAllProducts = async (res) => {
    try {
        
        const result = await db.query('SELECT * FROM products'); 
        const rows = result[0]; 
        
        res.end(JSON.stringify(rows)); 
    } catch (err) {
        res.end("error: " + err.message);
    }
};


exports.getLowStock = async (res) => {
    try {
        
        const [rows] = await db.query('SELECT * FROM products WHERE quantity <= min_stock');
        res.end(JSON.stringify(rows));
    } catch (err) {
        res.end("error: " + err.message);
    }
};


exports.addProduct = async (res, data) => {
    try {
        const sql = "INSERT INTO products (name, quantity, min_stock) VALUES (?, ?, ?)";
        const [result] = await db.execute(sql, [data.name, data.quantity, 5]); 
        
        res.end(JSON.stringify({ msg: "ok", id: result.insertId }));
    } catch (err) {
        res.end("add error : " + err.message);
    }
};


exports.updateStock = async (res, data) => {
    try {
        
        const [p] = await db.execute("SELECT * FROM products WHERE id = ?", [data.product_id]);
        
        if (p.length == 0) {
            return res.end("ไม่เจอสินค้าตัวนี้");
        }

        
        const d = new Date().toISOString().split('T')[0];
        await db.execute(
            "INSERT INTO stock_logs (product_id, type, amount, log_date) VALUES (?, ?, ?, ?)", 
            [data.product_id, data.type, data.amount, d]
        );

        
        let newQty = p[0].quantity;
        if (data.type == 'IN') {
            newQty = parseInt(newQty) + parseInt(data.amount);
        } else {
            newQty = parseInt(newQty) - parseInt(data.amount);
        }

        await db.execute("UPDATE products SET quantity = ? WHERE id = ?", [newQty, data.product_id]);

        
        res.end(JSON.stringify({
            status: "success",
            currentQuantity: newQty,
            lowStockAlert: newQty <= p[0].min_stock
        }));

    } catch (err) {
        console.log(err);
        res.end("update fail: " + err.message);
    }
};