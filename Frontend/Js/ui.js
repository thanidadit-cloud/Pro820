function showSection(id) {
    document.querySelectorAll('.section-content').forEach(s => {
        s.style.display = 'none';
    });
    
    let targetId = id === 'dashboard' ? 'section-dashboard' : id;
    const element = document.getElementById(targetId);
    if (element) { element.style.display = 'block'; }

    if (targetId === 'section-list') loadAllProducts();
    if (targetId === 'section-low') loadLowStock();
    if (targetId === 'section-report') loadReport('daily');
}

function handleLogout() {
    if (confirm("คุณต้องการออกจากระบบใช่หรือไม่?")) {
        localStorage.removeItem('userName');
        location.reload(); 
    }
}

window.onload = () => {
    document.getElementById('section-login')?.classList.remove('hidden');
    document.getElementById('main-app')?.classList.add('hidden');
};