finance.cstick = function() {
    var xScale = d3.time.scale(),
        yScale = d3.scale.linear();

    var isUpDay = function(d) {
        return d.close > d.open;
    };
    var isDownDay = function (d) {
        return !isUpDay(d);
    };

    var line = d3.svg.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; });

    var highLowLines = function(bars) {
        var paths = bars
            .selectAll('.high-low-line')
            .data(function(d) {
                return [d];
            });

        paths.enter().append('path');

        paths.classed('high-low-line', true)
            .attr('d', function(d) {
                return line([
                    { x: xScale(d.date), y: yScale(d.high) },
                    { x: xScale(d.date), y: yScale(d.low) }
                ]);
            });
    };

    var rectangles = function(bars, data) {
        var rect,
            rectangleWidth = 120 / data.length;

        rect = bars.selectAll('rect').data(function(d) {
            return [d];
        });

        rect.enter().append('rect');

        rect
            .attr('x', function(d) {
                return xScale(d.date) - rectangleWidth;
            })
            .attr('y', function(d) {
                return isUpDay(d) ? yScale(d.close) : yScale(d.open);
            })
            .attr('width', rectangleWidth * 2)
            .attr('height', function(d) {
                return isUpDay(d)
                    ? yScale(d.open) - yScale(d.close)
                    : yScale(d.close) - yScale(d.open);
            });
    };

    var cstick = function(selection) {
        var series, bars;

        selection.each(function(data) {
            // Generate ohlc bars here
            series = d3.select(this).selectAll('.cstick-series').data([data]);
            series.enter().append('g').classed('cstick-series', true);

            bars = series.selectAll('.bar')
                .data(data, function(d) {
                    return d.date;
                });

            bars.enter()
                .append('g')
                .classed('bar', true);

            bars.classed({
                'up-day': function(d) {
                    return d.close > d.open;
                },
                'down-day': function(d) {
                    return d.close <= d.open;
                }
            });
            highLowLines(bars);
            rectangles(bars, data);

            bars.exit().remove();
        });
    };

    cstick.xScale = function(value) {
        if(!arguments.length) {
            return xScale;
        }
        xScale = value;
        return cstick;
    };

    cstick.yScale = function(value) {
        if(!arguments.length) {
            return yScale;
        }
        yScale = value;
        return cstick;
    };

    return cstick;
};
