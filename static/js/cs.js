(function() {
    $('#cs-form').submit(function(e) {
        e.preventDefault();
        $('#chart').html('');
        $('#loading').html('<img src="static/images/ajax-loader.gif">');
        days = $('#days').val();
        $.post('html/cs', $('#cs-form').serialize())
            .done(function(d) {
                finance.build.cstick(d, '#chart', days);
                $('#loading').html('');
            }).fail(function() {
                $('#loading').html('<h3 style="color:red">Sorry, you\'re request failed. Please try again.</h3>');
            });
    });
})();
