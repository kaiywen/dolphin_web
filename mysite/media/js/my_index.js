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

jQuery.validator.addMethod("ip",
    function(value, element) {
        return this.optional(element) ||
            (/^_*(\d+)_*\._*(\d+)_*\._*(\d+)_*\._*(\d+)_*$/.test(value) &&
                (RegExp.$1 < 256 && RegExp.$1 >= 0 && RegExp.$2 < 256 && RegExp.$2 >= 0 &&
                    RegExp.$3 < 256 && RegExp.$3 >= 0 && RegExp.$4 < 256 && RegExp.$4 >= 0));
    },
    "Please enter a valid ip address.");

var SexecForm = function() {

    return {
        //main function to initiate the module
        init: function() {

            $('.s_exec_form').validate({
                errorElement: 'label', //default input error message container
                errorClass: 'help-inline', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
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

                invalidHandler: function(event, validator) { //display error alert on form submit   
                    $('.s_exec_form').show();
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

                submitHandler: function(form) {
                    /*                    var username = $("#username").val();
                                        var password = $("#password").val();
                                        $.ajax({
                                            type: 'POST',
                                            url: "/login.html/",
                                            cache: false,
                                            data: {
                                                "username": username,
                                                "password": password
                                            },
                                            success: function(data, textStatus) {
                                                if (data == "error") {
                                                    $(".alert-error span").html("incorrect username or password !");
                                                    $(".alert-error").show();
                                                } else {
                                                    window.location.href = data;
                                                }
                                            },
                                            error: function(XMLHttpRequest, textStatus, errorThrown) {}

                                        });*/
                }
            });
        }

    };

}();

var MexecForm = function() {

    return {
        //main function to initiate the module
        init: function() {

            $('.m_exec_form').validate({
                errorElement: 'label', //default input error message container
                errorClass: 'help-inline', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
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

                invalidHandler: function(event, validator) { //display error alert on form submit   
                    $('.m_exec_form').show();
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

                submitHandler: function(form) {
                    /*                    var username = $("#username").val();
                                        var password = $("#password").val();
                                        $.ajax({
                                            type: 'POST',
                                            url: "/login.html/",
                                            cache: false,
                                            data: {
                                                "username": username,
                                                "password": password
                                            },
                                            success: function(data, textStatus) {
                                                if (data == "error") {
                                                    $(".alert-error span").html("incorrect username or password !");
                                                    $(".alert-error").show();
                                                } else {
                                                    window.location.href = data;
                                                }
                                            },
                                            error: function(XMLHttpRequest, textStatus, errorThrown) {}

                                        });*/
                }
            });
        }

    };

}();
