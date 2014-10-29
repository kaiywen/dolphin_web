$("#s_exec_ipmi").click(function() {
    $.blockUI({ //当点击事件发生时调用弹出层
        message: $('#box'), //要弹出的元素box
        css: { //弹出元素的CSS属性
            top: '23%',
            left: '40%',
            textAlign: 'center',
            marginLeft: '0px',
            marginTop: '0px',
            width: '400px',
            background: 'none'
        }
    });
    $('.blockOverlay').attr('title', '单击关闭').click($.unblockUI);
});

/*            var username = $("#s_username").val();
            var password = $("#s_password").val();
            var ip_addr = $("#input_ipv4").val();
            alert(ip_addr);
            alert(username);
            alert(password);
            $.ajax({
                type: 'POST',
                url: "/exec.html/",
                cache: false,
                data: {
                    "username": username,
                    "password": password,
                    "ip": ip_addr
                },
                success: function(data, textStatus) {
                    if (data == "error") {} else {}
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {}

            });*/
