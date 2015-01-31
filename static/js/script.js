$(function() {
    var stateObj = {};

    $.get('html/home')
        .done(function (d) {
            $('#dynamic-content').html(d);
        });

    $('.linker').click(function(e) {
        e.preventDefault()
        var state = $(this).attr('href');
        var url = "html/" + state;
        $.get(url)
            .done(function(d){
                $('#dynamic-content').html(d);
                history.pushState(stateObj, state, state);
            });
    });

    $(window).bind('popstate', function (e) {
        $.get('html' + document.location.pathname)
            .done(function(d){
                $('#dynamic-content').html(d);
            });
    });
});
