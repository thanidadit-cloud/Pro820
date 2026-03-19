// กำหนด URL ของ Backend
const API = 'http://localhost:3000';

// --- 1. ฟังก์ชันจัดการ Login ---
async function handleLogin() {
    const username = document.getElementById('loginUser').value;
    const password = document.getElementById('loginPass').value;

    if (!username || !password) return alert("กรุณากรอกข้อมูลให้ครบ");

    try {
        // ส่งข้อมูลไปเช็คที่ Backend
        const res = await axios.post(`${API}/login`, { username, password });
        alert(`ยินดีต้อนรับคุณ ${res.data.user.fullname || res.data.user.name}`);
        
        // เมื่อ Login สำเร็จ: ซ่อนหน้า Login และแสดงหน้าแอปหลัก
        document.getElementById('section-login').classList.add('hidden');
        document.getElementById('main-app').classList.remove('hidden');
        
        // เริ่มต้นที่หน้า Dashboard
        showSection('section-dashboard');
    } catch (error) {
        console.error("Login Error:", error);
        alert("Login ไม่สำเร็จ: ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    }
}

// --- 2. ฟังก์ชันจัดการ Logout ---
function handleLogout() {
    if (confirm("คุณต้องการออกจากระบบใช่หรือไม่?")) {
        // ล้างค่าข้อมูลในช่อง Input
        document.getElementById('loginUser').value = '';
        document.getElementById('loginPass').value = '';
        
        // สลับหน้าจอกลับไปที่หน้า Login และซ่อนแอปหลัก
        document.getElementById('section-login').classList.remove('hidden');
        document.getElementById('main-app').classList.add('hidden');
    }
}

// --- 3. ฟังก์ชันสลับหน้าจอภายในแอป (UI Logic) ---
function showSection(id) {
    // ซ่อนเนื้อหาทุกส่วนที่มีคลาส .section-content ก่อน
    document.querySelectorAll('.section-content').forEach(s => {
        s.style.display = 'none';
    });
    
    // แสดงส่วนที่เลือกโดยใช้ ID
    const element = document.getElementById(id);
    if (element) {
        element.style.display = 'block';
    }

    // Auto-load ข้อมูลอัตโนมัติเมื่อเข้าแต่ละหน้า
    if (id === 'section-list') loadAllProducts();
    if (id === 'section-low') loadLowStock();
    if (id === 'section-report') document.getElementById('reportDisplay').innerHTML = '';
}

// เมื่อโหลดหน้าเว็บครั้งแรก (กั้นไว้ที่หน้า Login)
window.onload = () => {
    document.getElementById('section-login').classList.remove('hidden');
    document.getElementById('main-app').classList.add('hidden');
};

// --- 4. ฟังก์ชัน API: ดึงข้อมูลสินค้าทั้งหมด ---
async function loadAllProducts() {
    try {
        const res = await axios.get(`${API}/all-products`);
        let html = '<table><tr><th>ID</th><th>ชื่อสินค้า</th><th>คงเหลือ</th></tr>';
        
        res.data.forEach(item => {
            html += `<tr><td><strong>${item.id}</strong></td><td>${item.name}</td><td>${item.quantity}</td></tr>`;
        });
        
        html += '</table>';
        document.getElementById('allProductsDisplay').innerHTML = res.data.length ? html : '<p>ไม่มีสินค้าในระบบ</p>';
    } catch (error) { 
        console.error("Error loading products:", error); 
        document.getElementById('allProductsDisplay').innerHTML = '<p>ไม่สามารถโหลดข้อมูลได้</p>';
    }
}

// --- 5. ฟังก์ชัน API: เพิ่มสินค้าใหม่ ---
async function addProduct() {
    const name = document.getElementById('newName').value;
    const quantity = parseInt(document.getElementById('newQty').value);
    
    if (!name || isNaN(quantity)) return alert("กรุณากรอกข้อมูลให้ครบ");
    
    try {
        await axios.post(`${API}/add-product`, { name, quantity, min_stock: 5 });
        alert("เพิ่มสินค้าเรียบร้อย!");
        
        // ล้างค่าในช่องกรอก
        document.getElementById('newName').value = '';
        document.getElementById('newQty').value = '';
        
        // กลับไปหน้าแสดงรายการ
        showSection('section-list');
    } catch (error) { 
        alert("เกิดข้อผิดพลาดในการบันทึก"); 
    }
}

// --- 6. ฟังก์ชัน API: บันทึกสต็อกเข้า-ออก ---
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
    } catch (error) { 
        alert("ไม่สามารถบันทึกรายการได้ (เช็ค ID สินค้า)"); 
    }
}

// --- 7. ฟังก์ชัน API: เช็คสินค้าใกล้หมด ---
async function loadLowStock() {
    try {
        const res = await axios.get(`${API}/low-stock`);
        let html = '<table><tr><th>ID</th><th>ชื่อ</th><th>คงเหลือ</th></tr>';
        
        res.data.forEach(item => {
            html += `<tr class="low-stock"><td>${item.id}</td><td>${item.name}</td><td>${item.quantity}</td></tr>`;
        });
        
        html += '</table>';
        document.getElementById('lowStockDisplay').innerHTML = res.data.length ? html : '<p style="color:green; text-align:center;">✅ ไม่มีสินค้าใกล้หมด</p>';
    } catch (err) { 
        console.error("Error loading low stock:", err); 
    }
}

// --- 8. ฟังก์ชัน API: สรุปรายงาน ---
async function loadReport(mode) {
    const path = mode === 'daily' ? '/report-daily' : '/report-monthly';
    try {
        const res = await axios.get(`${API}${path}`);
        if (!res.data || !res.data.length) {
            document.getElementById('reportDisplay').innerHTML = '<p style="text-align:center; margin-top:20px;">ไม่มีข้อมูลรายงานในขณะนี้</p>';
            return;
        }
        
        let html = `<table><tr><th>${mode === 'daily' ? 'วันที่' : 'เดือน'}</th><th>ประเภท</th><th>ยอดรวม</th></tr>`;
        
        res.data.forEach(item => {
            html += `<tr><td>${item.date || item.month || 'ไม่ระบุ'}</td><td>${item.type}</td><td><strong>${item.total}</strong></td></tr>`;
        });
        
        html += '</table>';
        document.getElementById('reportDisplay').innerHTML = html;
    } catch (error) { 
        console.error("Report Error:", error);
        alert("ไม่สามารถดึงรายงานได้"); 
    }
}