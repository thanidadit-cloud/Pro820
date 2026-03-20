const API = 'http://localhost:8000';

const fetchApi = {
    get: (path) => axios.get(`${API}${path}`),
    post: (path, data) => axios.post(`${API}${path}`, data)
};

async function doLogin() {
    const userField = document.getElementById('loginUser');
    const passField = document.getElementById('loginPass');
    const errorDisplay = document.getElementById('login-error');

    const username = userField.value.trim();
    const password = passField.value.trim();

    if (errorDisplay) errorDisplay.innerText = ""; 

    try {
        const response = await fetchApi.post('/login', { username, password });
        
        
        if (response.data && response.data.success === true) {
            
            // 1. เก็บชื่อและแสดงผลที่มุมขวาบน
            localStorage.setItem('userName', response.data.name);
            const displayEl = document.getElementById('displayUserName');
            if (displayEl) displayEl.innerText = response.data.name;

            // 2. สลับหน้าจอ (ซ่อน Login โชว์หน้าหลัก)
            document.getElementById('section-login').style.display = 'none';
            document.getElementById('main-app').classList.remove('hidden');
            
            // 3. เรียกฟังก์ชัน UI เพื่อโหลดหน้า Dashboard
            if (typeof showSection === 'function') {
                showSection('dashboard');
            }

            // ล้างช่องกรอกข้อมูล
            userField.value = "";
            passField.value = "";

        } else {
            // ถ้ากรอกผิด แต่ Backend ยังตอบกลับมาได้
            errorDisplay.innerText = (response.data.message || "ข้อมูลไม่ถูกต้อง");
        }
    } catch (error) {
        // กรณี Server ปิดอยู่ หรือ Network มีปัญหา
        if (error.response && error.response.data) {
            errorDisplay.innerText = error.response.data.message;
        } else {
            errorDisplay.innerText = "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ (เปิด Backend หรือยัง?)";
        }
    }
}