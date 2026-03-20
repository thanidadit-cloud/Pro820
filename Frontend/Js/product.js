async function loadAllProducts() {
    try {
        const res = await fetchApi.get('/all-products');
        let html = '<table><tr><th>ID</th><th>ชื่อสินค้า</th><th>คงเหลือ</th></tr>';
        res.data.forEach(item => {
            html += `<tr><td><strong>${item.id}</strong></td><td>${item.name}</td><td>${item.quantity}</td></tr>`;
        });
        document.getElementById('allProductsDisplay').innerHTML = res.data.length ? html + '</table>' : '<p>ไม่มีสินค้าในระบบ</p>';
    } catch (error) { 
        console.error(error); 
    }
}

async function addProduct() {
    const name = document.getElementById('newName').value;
    const quantity = parseInt(document.getElementById('newQty').value);
    const errorDisplay = document.getElementById('add-error');
    
    if (errorDisplay) errorDisplay.innerText = "";

    if (!name || isNaN(quantity) || quantity < 1) {
        if (errorDisplay) errorDisplay.innerText = "กรุณากรอกข้อมูลให้ครบถ้วน";
        return;
    }
    
    try {
        await fetchApi.post('/add-product', { name, quantity, min_stock: 5 });
        document.getElementById('newName').value = "";
        document.getElementById('newQty').value = "";
        showSection('section-list');
        loadAllProducts();
    } catch (error) { 
        if (errorDisplay) errorDisplay.innerText = "เกิดข้อผิดพลาดในการบันทึก";
    }
}

async function updateStock() {
    const product_id = parseInt(document.getElementById('logId').value);
    const type = document.getElementById('logType').value;
    const amount = parseInt(document.getElementById('logAmount').value);
    const errorDisplay = document.getElementById('update-error');
    
    if (errorDisplay) errorDisplay.innerText = "";

    // เช็คค่าว่างหรือค่าที่น้อยกว่า 1
    if (isNaN(product_id) || product_id < 1 || isNaN(amount) || amount < 1) {
        if (errorDisplay) errorDisplay.innerText = "ข้อมูลไม่ถูกต้อง";
        return;
    }
    
    try {
        await fetchApi.post('/update-stock', { product_id, type, amount });
        document.getElementById('logId').value = "";
        document.getElementById('logAmount').value = "";
        showSection('section-list');
        loadAllProducts();
    } catch (error) { 
        if (errorDisplay) errorDisplay.innerText = "บันทึกไม่ได้ (ตรวจสอบ ID สินค้า)";
    }
}

async function loadLowStock() {
    try {
        const res = await fetchApi.get('/low-stock');
        let html = '<table><tr><th>ID</th><th>ชื่อ</th><th>คงเหลือ</th></tr>';
        res.data.forEach(item => {
            html += `<tr class="low-stock"><td>${item.id}</td><td>${item.name}</td><td>${item.quantity}</td></tr>`;
        });
        document.getElementById('lowStockDisplay').innerHTML = res.data.length ? html + '</table>' : '<p>ไม่มีสินค้าใกล้หมด</p>';
    } catch (err) { 
        console.error(err); 
    }
}