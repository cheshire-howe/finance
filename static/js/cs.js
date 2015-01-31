(function() {
    $('#cs-form').submit(function(e) {
        e.preventDefault();
        $('#chart').html('');
        $('#loading').html('<img src="static/images/ajax-loader.gif">');
        $.post('html/cs', $('#cs-form').serialize())
            .done(function(d) {
                buildCstick(d);
                $('#loading').html('');
            }).fail(function() {
                $('#loading').html('<h3 style="color:red">Sorry, you\'re request failed. Please try again.</h3>');
            });
    });
})();

function buildCstick(data) {

    $.each(data, function(i, d) {
        d.date = d3.time.format.utc("%Y-%m-%dT%H:%M:%S.%LZ").parse(d.date);
    });

    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 660 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    var xScale = d3.time.scale(),
        yScale = d3.scale.linear();

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .ticks(5);

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left');

    var series = finance.cstick()
        .xScale(xScale)
        .yScale(yScale);

    var gridlines = finance.gridlines()
        .xScale(xScale)
        .yScale(yScale)
        .margin(margin)
        .width(width)
        .height(height);

    var svg = d3.select('#chart').classed('chart', true).append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

    // Create chart
    var g = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Create plot area
    var plotArea = g.append('g');
    plotArea.append('clipPath')
        .attr('id', 'plotAreaClip')
        .append('rect')
        .attr({ width: width, height: height });
    plotArea.attr('clip-path', 'url(#plotAreaClip)');

    var maxDate = d3.max(data, function(d) {
        return d.date;
    });

    var minDate = d3.min(data, function(d) {
        return d.date;
    });

    xScale.domain([
        new Date(minDate.getTime() - 8.64e7),
        new Date(maxDate.getTime() + 8.64e7)
    ]);

    yScale.domain([
        d3.min(data, function(d) {
            return d.low - (d.low * 0.01);
        }),
        d3.max(data, function(d) {
            return d.high + (d.high * 0.01);
        })
    ]).nice();

    xScale.range([0, width]);
    yScale.range([height, 0]);

    g.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);

    g.append('g')
        .attr('class', 'y axis')
        .call(yAxis);

    plotArea.append('g')
        .attr('class', 'gridlines')
        .call(gridlines);

    plotArea.append('g')
        .attr('class', 'series')
        .datum(data)
        .call(series);
}