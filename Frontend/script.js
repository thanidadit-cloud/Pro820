const API = 'http://localhost:3000';

// --- ฟังก์ชันสลับหน้าจอ (UI Logic) ---
function showSection(id) {
    document.querySelectorAll('.section-content').forEach(s => s.style.display = 'none');
    const target = (id === 'dashboard') ? 'section-dashboard' : id;
    const element = document.getElementById(target);
    if(element) element.style.display = 'block';

    // โหลดข้อมูลอัตโนมัติเมื่อเข้าหน้าจอที่เกี่ยวข้อง
    if(id === 'section-list') loadAllProducts();
    if(id === 'section-low') loadLowStock();
    if(id === 'section-report') document.getElementById('reportDisplay').innerHTML = '';
}

window.onload = () => {
    showSection('dashboard');
};

// --- ฟังก์ชันดึงข้อมูลสินค้าทั้งหมด ---
async function loadAllProducts() {
    try {
        const res = await axios.get(`${API}/all-products`);
        let html = '<table><tr><th>ID</th><th>ชื่อสินค้า</th><th>คงเหลือ</th></tr>';
        res.data.forEach(item => {
            html += `<tr><td><strong>${item.id}</strong></td><td>${item.name}</td><td>${item.quantity}</td></tr>`;
        });
        html += '</table>';
        document.getElementById('allProductsDisplay').innerHTML = res.data.length ? html : '<p>ไม่มีสินค้าในระบบ</p>';
    } catch (error) { console.error("Error loading products:", error); }
}

// --- ฟังก์ชันเพิ่มสินค้าใหม่ ---
async function addProduct() {
    const name = document.getElementById('newName').value;
    const quantity = parseInt(document.getElementById('newQty').value);
    if (!name || isNaN(quantity)) return alert("กรุณากรอกข้อมูลให้ครบ");
    
    try {
        await axios.post(`${API}/add-product`, { name, quantity, min_stock: 5 });
        alert("เพิ่มสินค้าเรียบร้อย!");
        document.getElementById('newName').value = '';
        document.getElementById('newQty').value = '';
        showSection('section-list');
    } catch (error) { alert("เกิดข้อผิดพลาดในการบันทึก"); }
}

// --- ฟังก์ชันบันทึกสต็อกเข้า-ออก ---
async function updateStock() {
    const product_id = parseInt(document.getElementById('logId').value);
    const type = document.getElementById('logType').value;
    const amount = parseInt(document.getElementById('logAmount').value);
    
    if (isNaN(product_id) || isNaN(amount)) return alert("กรุณากรอกข้อมูลให้ถูกต้อง");
    
    try {
        const res = await axios.post(`${API}/update-stock`, { product_id, type, amount });
        alert(res.data.message);
        document.getElementById('logId').value = '';
        document.getElementById('logAmount').value = '';
        showSection('section-list');
    } catch (error) { alert("ไม่สามารถบันทึกรายการได้ (เช็ค ID สินค้า)"); }
}

// --- ฟังก์ชันเช็คสินค้าใกล้หมด ---
async function loadLowStock() {
    try {
        const res = await axios.get(`${API}/low-stock`);
        let html = '<table><tr><th>ID</th><th>ชื่อ</th><th>คงเหลือ</th></tr>';
        res.data.forEach(item => {
            html += `<tr class="low-stock"><td>${item.id}</td><td>${item.name}</td><td>${item.quantity}</td></tr>`;
        });
        html += '</table>';
        document.getElementById('lowStockDisplay').innerHTML = res.data.length ? html : '<p style="color:green; text-align:center;">✅ ไม่มีสินค้าใกล้หมด</p>';
    } catch (err) { console.error("Error loading low stock:", err); }
}

// --- ฟังก์ชันสรุปรายงาน ---
async function loadReport(mode) {
    const path = mode === 'daily' ? '/report-daily' : '/report-monthly';
    try {
        const res = await axios.get(`${API}${path}`);
        if (!res.data.length) {
            document.getElementById('reportDisplay').innerHTML = '<p style="text-align:center; margin-top:20px;">ไม่มีข้อมูลรายงานในขณะนี้</p>';
            return;
        }
        let html = `<table><tr><th>${mode === 'daily' ? 'วันที่' : 'เดือน'}</th><th>ประเภท</th><th>ยอดรวม</th></tr>`;
        res.data.forEach(item => {
            // มั่นใจว่า item.date มีค่า (แก้ปัญหา undefined ที่คุณเจอในรูป)
            html += `<tr><td>${item.date || 'ไม่ระบุวันที่'}</td><td>${item.type}</td><td><strong>${item.total}</strong></td></tr>`;
        });
        html += '</table>';
        document.getElementById('reportDisplay').innerHTML = html;
    } catch (error) { alert("ไม่สามารถดึงรายงานได้"); }
}