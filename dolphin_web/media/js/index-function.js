/*$("#s_exec_ipmi").click(function() {
    $.blockUI({
        message: $('#box'), 
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
    $('.blockOverlay').attr('title', 'shutdown').click($.unblockUI);
});*/

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
                    s_username: { required: true },
                    s_password: { required: true },
                    s_input_ipv4: { ip: true }
                },
                messages: {
                    s_username: { required: "Username is required." },
                    s_password: { required: "Password is required." },
                    s_input_ipv4: { ip: "A valid IP is required." }
                },
                submitHandler: function(form) { 
                    block.appear();
                }
            });
        }
    };
}();

var MexecForm = function() {

    return {
        init: function() {
            $('#m-exec-form').validate({
                rules: {
                    m_username: { required: true },
                    m_password: { required: true },
                    m_input_ipv4: { ip: true }
                },
                messages: {
                    m_username: { required: "Username is required." },
                    m_password: { required: "Password is required." },
                    m_input_ipv4: { ip: "A valid IP is required." }
                },
                submitHandler: function(form) {
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
            m_username: { required: true },
            m_password: { required: true },
            m_input_ipv4: { ip: true }
        },
        messages: {
            m_username: { required: "Username is required." },
            m_password: { required: "Password is required." },
            m_input_ipv4: { ip: "A valid IP is required." }
        },
    });
    if (form.valid()) {
        var username = $("#m_username").val();
        var password = $("#m_password").val();
        var ip_addr = $("#m_input_ipv4").val();
        var cmd = "<li>" + username + " " + ip_addr + "</li>";
        $("ul#cmd").append(cmd);
    }
});
