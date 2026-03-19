const product = require('../controllers/product');
const report = require('../controllers/report');

module.exports = async (path, method, req, res, bodyData) => {
    if (path === '/all-products' && method === 'GET') await product.getAllProducts(res);
    else if (path === '/low-stock' && method === 'GET') await product.getLowStock(res);
    else if (path === '/report-daily' && method === 'GET') await report.getDailyReport(res);
    else if (path === '/report-monthly' && method === 'GET') await report.getMonthlyReport(res);
    else if (path === '/add-product' && method === 'POST') await product.addProduct(res, bodyData);
    else if (path === '/update-stock' && method === 'POST') await product.updateStock(res, bodyData);
    else {
        res.writeHead(404);
        res.end(JSON.stringify({ message: "Path Not Found" }));
    }
};