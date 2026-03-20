async function loadReport(mode) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    const targetBtn = mode === 'daily' ? 'btn-daily' : 'btn-monthly';
    document.getElementById(targetBtn)?.classList.add('active');

    const path = mode === 'daily' ? '/report-daily' : '/report-monthly';

    try {
        const res = await axios.get(`${API}${path}`); 

        if (!res.data || !res.data.length) {
            document.getElementById('reportDisplay').innerHTML = '<p style="text-align:center; padding:20px;">ไม่มีข้อมูลรายงานในขณะนี้</p>';
            return;
        }
        
        let html = `<table><thead><tr>
                        <th>${mode === 'daily' ? 'วันที่' : 'เดือน'}</th>
                        <th>ประเภท</th><th>ยอดรวม</th>
                    </tr></thead><tbody>`;
        
        res.data.forEach(item => {
            let rawValue = item.date || item.month || 'ไม่ระบุ';
            let displayValue = rawValue;

            if (mode === 'daily' && rawValue !== 'ไม่ระบุ') {
                const dateObj = new Date(rawValue);
                const year = dateObj.getFullYear();
                const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                const day = String(dateObj.getDate()).padStart(2, '0');
                displayValue = `${year}-${month}-${day}`;
            }

            const typeClass = item.type === 'IN' ? 'status-in' : 'status-out';

            html += `<tr>
                <td>${displayValue}</td>
                <td class="${typeClass}"><strong>${item.type}</strong></td> 
                <td><strong>${item.total.toLocaleString()}</strong></td>
            </tr>`;
        });
        
        html += '</tbody></table>';
        document.getElementById('reportDisplay').innerHTML = html;

    } catch (error) { 
        console.error("Report Error:", error);
    }
}