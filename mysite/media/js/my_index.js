$("#s_exec_ipmi").click(function() {
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
});

