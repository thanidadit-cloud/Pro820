// กำหนด URL ของ Backend (ตรวจสอบให้ตรงกับที่ Run Server ไว้)
const API = 'http://localhost:3000';

// --- 1. ฟังก์ชันจัดการ Login ---
async function handleLogin() {
    const username = document.getElementById('loginUser').value;
    const password = document.getElementById('loginPass').value;

    if (!username || !password) return alert("กรุณากรอกข้อมูลให้ครบ");

    try {
        // ส่งข้อมูลไปเช็คที่ Backend
        const res = await axios.post(`${API}/login`, { username, password });
        
        // แสดงชื่อผู้ใช้จากข้อมูลที่ส่งกลับมา
        alert(`ยินดีต้อนรับคุณ ${res.data.user.name}`);
        
        // เมื่อ Login สำเร็จ: สลับหน้าจอ
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
        
        // สลับหน้าจอกลับไปที่หน้า Login
        document.getElementById('section-login').classList.remove('hidden');
        document.getElementById('main-app').classList.add('hidden');
    }
}

// --- 3. ฟังก์ชันสลับหน้าจอ (UI Logic) ---
function showSection(id) {
    // ซ่อนเนื้อหาทุกส่วนก่อน
    document.querySelectorAll('.section-content').forEach(s => {
        s.style.display = 'none';
    });
    
    let targetId = id;
    if (id === 'dashboard') targetId = 'section-dashboard';

    const element = document.getElementById(targetId);
    if (element) {
        element.style.display = 'block';
    } else {
        // ป้องกันหน้าจอว่าง
        const dash = document.getElementById('section-dashboard');
        if (dash) dash.style.display = 'block';
    }

    //โหลดข้อมูลอัตโนมัติเมื่อเข้าแต่ละหน้า
    if (targetId === 'section-list') loadAllProducts();
    if (targetId === 'section-low') loadLowStock();
    if (targetId === 'section-report') {
        document.getElementById('reportDisplay').innerHTML = '<p style="text-align:center; color:#888; margin-top:20px;">กรุณากดปุ่มด้านบนเพื่อดูรายงาน</p>';
    }
}

// เมื่อโหลดหน้าเว็บครั้งแรก
window.onload = () => {
    const loginSec = document.getElementById('section-login');
    const appSec = document.getElementById('main-app');
    if(loginSec) loginSec.classList.remove('hidden');
    if(appSec) appSec.classList.add('hidden');
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
        
        document.getElementById('newName').value = '';
        document.getElementById('newQty').value = '';
        
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

// --- 8. ฟังก์ชัน API: สรุปรายงาน (ฉบับปรับปรุงรูปแบบวันที่ให้เหมือน Studio 7) ---
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
            let rawValue = item.date || item.month || 'ไม่ระบุ';
            let displayValue = rawValue;

            // แปลงรูปแบบวันที่ ISO String ให้เป็นแบบไทย
            if (mode === 'daily' && rawValue !== 'ไม่ระบุ') {
                displayValue = new Date(rawValue).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            }

            // แยกสีตามประเภทสินค้าเข้า-ออก
            const typeStyle = item.type === 'IN' ? 'color: #28a745; font-weight: bold;' : 'color: #dc3545; font-weight: bold;';

            html += `<tr>
                <td>${displayValue}</td>
                <td style="${typeStyle}">${item.type}</td>
                <td><strong>${item.total}</strong></td>
            </tr>`;
        });
        
        html += '</table>';
        document.getElementById('reportDisplay').innerHTML = html;
    } catch (error) { 
        console.error("Report Error:", error);
        alert("ไม่สามารถดึงรายงานได้"); 
    }
}