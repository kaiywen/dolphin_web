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
                    $.ajax({
                        type: 'POST',
                        url: "/single_cmd.html/",
                        cache: false,
                        data: {
                            "username": username,
                            "password": password,
                            "ip_addr": ip_addr
                        },
                        success: function(data, textStatus) {
                            if (data == "error") {
                                $(".alert-error span").html("incorrect username or password !");
                                $(".alert-error").show();
                            } else {}
                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown) {}
                    });
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
                    $.ajax({
                        type: 'POST',
                        url: "/multi_cmd.html/",
                        cache: false,
                        data: {
                            "cmd_list": encoded_cmd_list
                        },
                        success: function(data, textStatus) {
                            if (data == "error") {
                                $(".alert-error span").html("incorrect username or password !");
                                $(".alert-error").show();
                            } else {}
                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown) {}
                    });
                    //block.appear();
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

    var sample_1_tb = $("#sample_1").dataTable();
    rows = sample_1_tb.fnGetNodes();
    if (severity == "ALL") {
        sample_1_tb.each(function() {
            for (var i = 0; i < rows.length; i++) {
                $(rows[i]).show();
            }
        });
    } else {
        sample_1_tb.each(function() {
            for (var i = 0; i < rows.length; i++) {
                if ($(rows[i]).children('td').eq(4).html() != severity)
                    $(rows[i]).hide();
                else
                    $(rows[i]).show();
            }
        });
    }

    if (date_from != "") {
        alert(date_from);
    }
    else if (date_to != "") {

    }
});
