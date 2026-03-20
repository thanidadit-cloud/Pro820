function loadAllProducts() {
    axios.get(API + '/all-products')
        .then(function (res) {
            var data = res.data;
            var table = '<table border="1">';
            table += '<tr><td>ID</td><td>Name</td><td>Qty</td></tr>';
            
            for (var i = 0; i < data.length; i++) {
                table += '<tr>';
                table += '<td>' + data[i].id + '</td>';
                table += '<td>' + data[i].name + '</td>';
                table += '<td>' + data[i].quantity + '</td>';
                table += '</tr>';
            }
            table += '</table>';

            if (data.length > 0) {
                document.getElementById('allProductsDisplay').innerHTML = table;
            } else {
                document.getElementById('allProductsDisplay').innerHTML = "ไม่มีข้อมูล";
            }
        })
        .catch(function (err) {
            console.log("error : " + err); 
        });
}


async function addProduct() {
    var n = document.getElementById('newName').value;
    var q = document.getElementById('newQty').value;

    
    if (n == "" || q == "") {
        alert("กรุณาใส่ข้อมูลให้ครบ"); 
        return;
    }

    try {
        
        await axios.post(API + '/add-product', {
            name: n,
            quantity: parseInt(q),
            min_stock: 5
        });

        alert("เพิ่มเสร็จแล้ว"); 
        
        
        document.getElementById('newName').value = "";
        document.getElementById('newQty').value = "";
        
        loadAllProducts(); 
    } catch (e) {
        console.log("error: ", e);
    }
}

function updateStock() {
    var id = document.getElementById('logId').value;
    var t = document.getElementById('logType').value;
    var a = document.getElementById('logAmount').value;

    axios.post(API + '/update-stock', {
        product_id: id,
        type: t,
        amount: a
    }).then(res => {
        // เช็คเงื่อนไขแบบบ้านๆ
        if(res.data.lowStockAlert == true) {
            document.getElementById('update-error').innerHTML = "เตือน: ของเหลือแค่ " + res.data.currentQuantity;
            document.getElementById('update-error').style.color = "red";
        } else {
            alert("บันทึกแล้ว");
        }
        loadAllProducts();
    }).catch(err => {
        console.log(err);
        alert("ID ผิด");
    });
}