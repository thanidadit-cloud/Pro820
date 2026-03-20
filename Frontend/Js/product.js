async function loadAllProducts() {
    try {
        const res = await axios.get(`${API}/all-products`);
        let html = '<table><tr><th>ID</th><th>ชื่อสินค้า</th><th>คงเหลือ</th></tr>';
        
        res.data.forEach(item => {
            html += `<tr><td><strong>${item.id}</strong></td><td>${item.name}</td><td>${item.quantity}</td></tr>`;
        });
        
        document.getElementById('allProductsDisplay').innerHTML = res.data.length ? html + '</table>' : '<p>ไม่มีสินค้าในระบบ</p>';
    } catch (error) { 
        console.error("Load Products Error:", error); 
    }
}


async function addProduct() {
    const name = document.getElementById('newName').value;
    const quantity = parseInt(document.getElementById('newQty').value);
    const errorDisplay = document.getElementById('add-error');
    
    if (errorDisplay) {
        errorDisplay.innerText = "";
        errorDisplay.style.display = "none";
        errorDisplay.style.color = "red";
    }

    if (!name || isNaN(quantity) || quantity < 1) {
        if (errorDisplay) {
            errorDisplay.innerText = "กรุณากรอกข้อมูลให้ครบถ้วน";
            errorDisplay.style.display = "block";
        }
        return;
    }
    
    try {
    
        await axios.post(`${API}/add-product`, { name, quantity, min_stock: 5 });
        
        if (errorDisplay) {
            errorDisplay.innerText = "เพิ่มสินค้าใหม่เรียบร้อยแล้ว";
            errorDisplay.style.color = "green"; 
            errorDisplay.style.display = "block";
        }

        document.getElementById('newName').value = "";
        document.getElementById('newQty').value = "";
        
        loadAllProducts(); 
    } catch (error) { 
        if (errorDisplay) {
            errorDisplay.innerText = "เกิดข้อผิดพลาดในการบันทึก";
            errorDisplay.style.color = "red";
            errorDisplay.style.display = "block";
        }
    }
}

async function updateStock() {
    const product_id = parseInt(document.getElementById('logId').value);
    const type = document.getElementById('logType').value;
    const amount = parseInt(document.getElementById('logAmount').value);
    const errorDisplay = document.getElementById('update-error');
    
    
    if (errorDisplay) {
        errorDisplay.innerText = "";
        errorDisplay.style.display = "none";
    }

    
    if (isNaN(product_id) || product_id < 1 || isNaN(amount) || amount < 1) {
        if (errorDisplay) {
            errorDisplay.innerText = "ข้อมูลไม่ถูกต้อง";
            errorDisplay.style.color = "red";
            errorDisplay.style.display = "block";
        }
        return;
    }
    
    try {
        const res = await axios.post(`${API}/update-stock`, { product_id, type, amount });

        
        if (res.data.lowStockAlert) {
            if (errorDisplay) {
                errorDisplay.innerText = "สินค้าในสต็อกเหลือต่ำกว่าเกณฑ์ (คงเหลือ: " + res.data.currentQuantity + ")";
                errorDisplay.style.color = "red"; // เปลี่ยนเป็นสีแดงทันที
                errorDisplay.style.display = "block";
            }
        } else {
            
            if (errorDisplay) {
                errorDisplay.innerText = "บันทึกข้อมูลเรียบร้อยแล้ว";
                errorDisplay.style.color = "green";
                errorDisplay.style.display = "block";
            }
        }

        
        document.getElementById('logId').value = "";
        document.getElementById('logAmount').value = "";
        
        loadAllProducts(); 
        
    } catch (error) { 
        if (errorDisplay) {
            errorDisplay.innerText = "บันทึกไม่ได้ (ตรวจสอบ ID สินค้า)";
            errorDisplay.style.color = "red";
            errorDisplay.style.display = "block";
        }
    }
}


async function loadLowStock() {
    try {
        const res = await axios.get(`${API}/low-stock`);
        let html = '<table><tr><th>ID</th><th>ชื่อ</th><th>คงเหลือ</th></tr>';
        
        res.data.forEach(item => {
            html += `<tr class="low-stock"><td>${item.id}</td><td>${item.name}</td><td>${item.quantity}</td></tr>`;
        });
        
        document.getElementById('lowStockDisplay').innerHTML = res.data.length ? html + '</table>' : '<p>✅ ไม่มีสินค้าใกล้หมด</p>';
    } catch (err) { 
        console.error("Load Low Stock Error:", err); 
    }
}