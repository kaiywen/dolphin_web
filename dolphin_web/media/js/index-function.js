//$('.blockOverlay').attr('title', 'shutdown').click($.unblockUI);

var block = function() {
    return {
        appear: function() {
            $.blockUI({
                message: $('#box'),
                applyPlatformOpacityRules: false,
                css: {
                    top: '23%',
                    left: '40%',
                    textAlign: 'center',
                    marginLeft: '0px',
                    marginTop: '0px',
                    width: '400px',
                    background: 'none'
                }
            });
        }
    };
}();

jQuery.validator.addMethod("ip",
    function(value, element) {
        return this.optional(element) ||
            (/^_*(\d+)_*\._*(\d+)_*\._*(\d+)_*\._*(\d+)_*$/.test(value) &&
                (RegExp.$1 < 256 && RegExp.$1 >= 0 && RegExp.$2 < 256 && RegExp.$2 >= 0 &&
                    RegExp.$3 < 256 && RegExp.$3 >= 0 && RegExp.$4 < 256 && RegExp.$4 >= 0));
    },
    "Please enter a valid ip address.");

jQuery.validator.setDefaults({
    errorElement: 'label', //default input error message container
    errorClass: 'help-inline', // default input error message class
    focusInvalid: false, // do not focus the last invalid input

    invalidHandler: function(event, validator) { //display error alert on form submit   
        $('.exec-form').show();
    },

    highlight: function(element) { // hightlight error inputs
        $(element).closest('.control-group').addClass('error'); // set error class to the control group
    },

    success: function(label) {
        label.closest('.control-group').removeClass('error');
        label.remove();
    },

    errorPlacement: function(error, element) {
        error.addClass('help-small no-left-padding').insertAfter(element.closest('.input-icon'));
    },
});

var SexecForm = function() {
    return {
        init: function() {
            $('#s-exec-form').validate({
                rules: {
                    s_username: {
                        required: true
                    },
                    s_password: {
                        required: true
                    },
                    s_input_ipv4: {
                        ip: true
                    }
                },
                messages: {
                    s_username: {
                        required: "Username is required."
                    },
                    s_password: {
                        required: "Password is required."
                    },
                    s_input_ipv4: {
                        ip: "A valid IP is required."
                    }
                },
                submitHandler: function(form) {
                    var username = $("#s_username").val();
                    var password = $("#s_password").val();
                    var ip_addr = $("#s_input_ipv4").val();
                    (function poll(un = "", pw = "", ip = "", rt = 1, rc = 1) {
                        $.ajax({
                            type: 'POST',
                            url: "/sel_query.html/",
                            cache: false,
                            data: {
                                "username": un,
                                "password": pw,
                                "ip_addr": ip,
                                "request_type": rt,
                                "request_class": rc
                            },
                            success: function(data, textStatus) {
                                switch (data) {
                                    case "error":
                                        $(".alert-error span").html("incorrect username or password !");
                                        $(".alert-error").show();
                                        break;
                                    case "1":
                                        $("#box p").html(" Running commands, wait please!");
                                        poll("", "", "", 2, 1);
                                        break;
                                    case "2":
                                        $("#box p").html(" Querying finished !");
                                        $('#box').click(function() {
                                            poll("", "", "", 3, 1);
                                            $.unblockUI();
                                        });
                                        break;
                                    case "3":
                                        $("#box p").html(" Querying failed !");
                                        break;
                                    default:
                                        $("#table-div").html(data);
                                        TableAdvanced.init();
                                }
                            },
                            error: function(XMLHttpRequest, textStatus, errorThrown) {}
                        });
                    })(username, password, ip_addr, 1, 1);
                    block.appear();
                }
            });
        }
    };
}();

var passwd_array = [];
var MexecForm = function() {

    return {
        init: function() {
            $('#m-exec-form').validate({
                rules: {
                    m_username: {
                        required: true
                    },
                    m_password: {
                        required: true
                    },
                    m_input_ipv4: {
                        ip: true
                    }
                },
                messages: {
                    m_username: {
                        required: "Username is required."
                    },
                    m_password: {
                        required: "Password is required."
                    },
                    m_input_ipv4: {
                        ip: "A valid IP is required."
                    }
                },
                submitHandler: function(form) {
                    var cmd_ul = $("ul#cmd");
                    var cmd_list = [];
                    var index = 0;
                    cmd_ul.children("li").each(function() {
                        var li_var = $(this).text();
                        var cmd_info = li_var.split(" ");
                        var cmd = {
                            "username": cmd_info[0],
                            "ip_addr": cmd_info[1],
                            "password": passwd_array[$(this).index()]
                        }
                        cmd_list.push(cmd);
                    });
                    var encoded_cmd_list = $.toJSON(cmd_list);

                    (function poll(cmd = "", rt = 1, rc = 2) {
                        $.ajax({
                            type: 'POST',
                            url: "/sel_query.html/",
                            cache: false,
                            data: {
                                "cmd_list": cmd,
                                "request_type": rt,
                                "request_class": rc
                            },
                            success: function(data, textStatus) {
                                switch (data) {
                                    case "error":
                                        $(".alert-error span").html("incorrect username or password !");
                                        $(".alert-error").show();
                                        break;
                                    case "1":
                                        $("#box p").html("Running commands, wait please !");
                                        poll("", 2, 2);
                                        break;
                                    case "2":
                                        $("#box p").html("Querying finished !");
                                        $('#box').click(function() {
                                            poll("", 3, 2);
                                            $.unblockUI();
                                        });
                                        break;
                                    case "3":
                                        $("#box p").html("Querying failed !");
                                        break;
                                    default:
                                        $("#table-div").html(data);
                                        TableAdvanced.init();
                                        $("#box p").html("Running commands, wait please !");
                                }
                            },
                            error: function(XMLHttpRequest, textStatus, errorThrown) {}
                        });
                    })(encoded_cmd_list, 1, 2);
                    block.appear();
                }
            });
        }
    };
}();

$("#m_exec_add").click(function() {
    var form = $('#m-exec-form');
    form.validate({
        rules: {
            m_username: {
                required: true
            },
            m_password: {
                required: true
            },
            m_input_ipv4: {
                ip: true
            }
        },
        messages: {
            m_username: {
                required: "Username is required."
            },
            m_password: {
                required: "Password is required."
            },
            m_input_ipv4: {
                ip: "A valid IP is required."
            }
        },
    });
    if (form.valid()) {
        var username = $("#m_username").val();
        var password = $("#m_password").val();
        var ip_addr = $("#m_input_ipv4").val();
        var cmd = "<li class='li-selectable'>" + username + " " + ip_addr + "</li>";
        $("ul#cmd").append(cmd);
        passwd_array.push(password);
    }
});

$('li.li-selectable').live('click', function() {
    $(this).css('background', 'rgba(82, 168, 236, 0.8)')
    $(this).addClass("li-cmd-selected");
    $(this).siblings().css('background', 'none');
    $(this).siblings().removeClass("li-cmd-selected");
});

$("#m_exec_del").click(function() {
    var index = $("li.li-cmd-selected").index();
    if (index != -1) {
        $("li.li-cmd-selected").remove();
        passwd_array.splice(index, 1);
    }
});

$("#search").click(function() {
    var severity = $("#chosen-severity").val();
    var date_from = $("#date-from").val();
    var date_to = $("#date-to").val();
    var fDate, tDate;
    fDate = new Date(Date.parse(date_from, "yyyy-mm-dd hh:ii:ss"));
    if (date_to != "")
        tDate = new Date(Date.parse(date_to, "yyyy-mm-dd hh:ii:ss"));
    else
        tDate = new Date(Date.parse("3000-01-01 00:00:00", "yyyy-mm-dd hh:ii:ss"));

    var sample_1_tb = $("#sample_1").dataTable();
    rows = sample_1_tb.fnGetNodes();

    if (severity == "ALL") {
        sample_1_tb.each(function() {
            for (var i = 0; i < rows.length; i++) {
                var timestamp = $(rows[i]).children('td').eq(3).html();
                var datetime = new Date(Date.parse(timestamp, "yyyy-mm-dd hh:ii:ss"));
                if (timestamp == "" || (datetime >= fDate && datetime < tDate))
                    $(rows[i]).show();
                else {
                    $(rows[i]).hide();
                }
            }
        });
    } else {
        sample_1_tb.each(function() {
            for (var i = 0; i < rows.length; i++) {
                var timestamp = $(rows[i]).children('td').eq(3).html();
                var datetime = new Date(Date.parse(timestamp, "yyyy-mm-dd hh:ii:ss"));
                if ($(rows[i]).children('td').eq(5).html() == severity && timestamp != "" &&
                    datetime >= fDate && datetime < tDate)
                    $(rows[i]).show();
                else
                    $(rows[i]).hide();
            }
        });
    }

});
