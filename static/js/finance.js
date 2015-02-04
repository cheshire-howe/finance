var finance = function() {};
finance.gridlines = function() {
    var xScale = d3.time.scale(),
        yScale = d3.scale.linear();

    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 660 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    var gridlines = function(selection) {
        selection.each(function(data) {

            var gridX = d3.select(this)
                .selectAll("line.horizontal-grid")
                .data(yScale.ticks(10));
            gridX.enter()
                .append("line")
                .attr({
                    "class":"horizontal-grid",
                    "x1" : 0,
                    "x2" : width,
                    "y1" : function(d){ return yScale(d);},
                    "y2" : function(d){ return yScale(d);},
                });

            var gridY = d3.select(this)
                .selectAll("line.vertical-grid")
                .data(xScale.domain().filter(function(d, i) {
                    return !(i % Math.round(xScale.domain().length / 5));
                }));

            gridY.enter()
                .append("line")
                .attr({
                    "class":"vertical-grid",
                    "x1" : function(d){ return xScale(d);},
                    "x2" : function(d){ return xScale(d);},
                    "y1" : 0,
                    "y2" : height,
                });
        });
    };

    gridlines.xScale = function(value) {
        if(!arguments.length) {
            return xScale;
        }
        xScale = value;
        return gridlines;
    };

    gridlines.yScale = function(value) {
        if(!arguments.length) {
            return yScale;
        }
        yScale = value;
        return gridlines;
    };

    gridlines.margin = function(value) {
        if(!arguments.length) {
            return margin;
        }
        margin = value;
        return gridlines;
    };

    gridlines.width = function(value) {
        if(!arguments.length) {
            return width;
        }
        width = value;
        return gridlines;
    };

    gridlines.height = function(value) {
        if(!arguments.length) {
            return height;
        }
        height = value;
        return gridlines;
    };

    return gridlines;
}
finance.build = {
    "cstick" : function(data, selection, days) {
        $.each(data, function(i, d) {
            d.date = d3.time.format("%Y-%m-%dT%H:%M:%S.%LZ").parse(d.date);
        });

        var maxDate = d3.max(data, function(d) {
            return d.date;
        });

        var minDate = d3.min(data, function(d) {
            return d.date;
        });

        var margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = 750 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        var xScale = d3.scale.ordinal();
            yScale = d3.scale.linear();

        var rp = 200 / data.length;
        xScale
            .domain($.map(data, function(d) {
                var format = d3.time.format("%B %d %Y");
                return format(d.date);
            }))
            .rangePoints([rp, width - rp]);

        yScale
            .domain([
                d3.min(data, function(d) {
                    return d.low - (d.low * 0.01);
                }),
                d3.max(data, function(d) {
                    return d.high + (d.high * 0.01);
                })
            ]).nice()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(xScale)
            .tickValues(xScale.domain().filter(function(d, i) {
                return !(i % Math.round(data.length / 5));
            }))
            .orient('bottom');

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

        var svg = d3.select(selection).classed('chart', true).append('svg')
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
}
