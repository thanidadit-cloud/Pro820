function showSection(id) {
    document.querySelectorAll('.section-content').forEach(s => {
        s.style.display = 'none';
    });


    let targetId = id.startsWith('section-') ? id : 'section-' + id;
    const element = document.getElementById(targetId);
    if (element) {
        element.style.display = 'block';
    }

    if (targetId === 'section-list') loadAllProducts();
    if (targetId === 'section-low') loadLowStock();
}

window.onload = () => {
    showSection('dashboard');
};