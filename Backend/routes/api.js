const product = require('../controllers/product');
const report = require('../controllers/report');
const auth = require('../controllers/username');  

module.exports = function(path, method, req, res, bodyData) {
    
    if (path == '/login') {
        if (method == 'POST') {
            auth.login(res, bodyData);
        }
    } 
    
    else if (path == '/all-products') {
        if (method == 'GET') {
            product.getAllProducts(res);
        }
    } 
    
    else if (path == '/low-stock') {
        if (method == 'GET') {
            product.getLowStock(res);
        }
    }

    else if (path == '/report-daily') {
        if (method == 'GET') {
            report.getDailyReport(res);
        }
    }

    else if (path == '/report-monthly') {
        if (method == 'GET') {
            report.getMonthlyReport(res);
        }
    }

    else if (path == '/add-product') {
        if (method == 'POST') {
            product.addProduct(res, bodyData);
        }
    }

    else if (path == '/update-stock') {
        if (method == 'POST') {
            product.updateStock(res, bodyData);
        }
    }

    else {
        res.writeHead(404);
        res.end(JSON.stringify({ msg: "error" }));
    }
};