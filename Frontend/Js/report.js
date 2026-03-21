function loadReport(mode) {
    document.getElementById('btn-daily').classList.remove('active');
    document.getElementById('btn-monthly').classList.remove('active');

    var myPath = "";
    if (mode == 'daily') {
        myPath = '/report-daily';
        document.getElementById('btn-daily').classList.add('active');
    } else {
        myPath = '/report-monthly';
        document.getElementById('btn-monthly').classList.add('active');
    }


    axios.get(API + myPath)
        .then(function (res) {
            var data = res.data;

            if (data.length == 0) {
                document.getElementById('reportDisplay').innerHTML = "ไม่มีข้อมูล";
                return;
            }

            var table = '<table border="1">';
            table = table + '<tr><td>วัน/เดือน</td><td>ประเภท</td><td>ยอดรวม</td></tr>';

            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                var display = "";

            
                if (mode == 'daily') {
                    var d = new Date(item.date);
                    display = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
                } else {
                    display = item.month;
                }

                table = table + '<tr>';
                table = table + '<td>' + display + '</td>';
                table = table + '<td>' + item.type + '</td>';
                table = table + '<td>' + item.total + '</td>';
                table = table + '</tr>';
            }
            table = table + '</table>';

            document.getElementById('reportDisplay').innerHTML = table;
        })
        .catch(function (err) {
            console.log("error: " + err);
        });
}