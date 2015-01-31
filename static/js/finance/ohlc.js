var finance = function() {};

finance.ohlc = function() {
    var xScale = d3.time.scale(),
        yScale = d3.scale.linear();

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

    var openCloseTicks = function(bars) {
        var open,
            close,
            tickWidth = 5;

        open = bars.selectAll('.open-tick').data(function(d) {
            return [d];
        });

        close = bars.selectAll('.close-tick').data(function(d) {
            return [d];
        });

        open.enter().append('path');
        close.enter().append('path');

        open.classed('open-tick', true)
            .attr('d', function(d) {
                return line([
                    { x: xScale(d.date) - tickWidth, y: yScale(d.open)},
                    { x: xScale(d.date), y: yScale(d.open)}
                ]);
            });

        close.classed('close-tick', true)
            .attr('d', function(d) {
                return line([
                    { x: xScale(d.date), y: yScale(d.close)},
                    { x: xScale(d.date) + tickWidth, y: yScale(d.close)}
                ]);
            });

        open.exit().remove();
        close.exit().remove();
    };

    var ohlc = function(selection) {
        var series, bars;

        selection.each(function(data) {
            // Generate ohlc bars here
            series = d3.select(this).selectAll('.ohlc-series').data([data]);
            series.enter().append('g').classed('ohlc-series', true);

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
            openCloseTicks(bars);

            bars.exit().remove();
        });
    };

    ohlc.xScale = function(value) {
        if(!arguments.length) {
            return xScale;
        }
        xScale = value;
        return ohlc;
    };

    ohlc.yScale = function(value) {
        if(!arguments.length) {
            return yScale;
        }
        yScale = value;
        return ohlc;
    };

    return ohlc;
};
