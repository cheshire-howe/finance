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
                .data(xScale.ticks(4));

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