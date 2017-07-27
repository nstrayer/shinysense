var d3 = require('d3');
var _a = require('./helpers'), simplifyData = _a.simplifyData, appendSVG = _a.appendSVG, makeScales = _a.makeScales, makeLine = _a.makeLine, makeClip = _a.makeClip, drawAxes = _a.drawAxes, dragCanvas = _a.dragCanvas, makeUserData = _a.makeUserData, clamp = _a.clamp, addToClosest = _a.addToClosest, drawStartValue = _a.drawStartValue;
var DrawIt = function (params) {
    var fullData = params.data, domTarget = params.domTarget, xKey = params.xKey, yKey = params.yKey, yDomain = params.yDomain, revealExtent = params.revealExtent, _a = params.totalHeight, totalHeight = _a === void 0 ? 400 : _a, _b = params.margin, margin = _b === void 0 ? { left: 50, right: 50, top: 30, bottom: 30 } : _b, _c = params.rawDraw, rawDraw = _c === void 0 ? false : _c, // does the user want to just draw with no data to show?
    _d = params.onDoneDrawing, // does the user want to just draw with no data to show?
    onDoneDrawing = _d === void 0 ? function (d) { return console.table(d); } : _d;
    // grab a d3 selection of the div we're going to be putting out drawr in. 
    var sel = d3.select(domTarget).html('');
    // rename the x and y columns to x and y. 
    var data = simplifyData({ fullData: fullData, xKey: xKey, yKey: yKey });
    // get actual viz height and width after accounting for the margins. 
    var totalWidth = sel.node().offsetWidth;
    var width = totalWidth - margin.left - margin.right;
    var height = totalHeight - margin.top - margin.bottom;
    // append an svg of the correct size to the div. 
    var svg = appendSVG({ sel: sel, totalHeight: totalHeight, totalWidth: totalWidth, margin: margin });
    // extract the y axis desires.   
    var yMin = yDomain[0], yMax = yDomain[1];
    var scales = makeScales({ data: data, yDomain: yDomain, height: height, width: width });
    var xMax = scales.xMax;
    var line = makeLine(scales);
    var clipRect = makeClip({ svg: svg, scales: scales, revealExtent: revealExtent, height: height });
    // user's drawn data
    var userLine = svg
        .append('path')
        .style('stroke', 'steelblue')
        .style('stroke-width', 3)
        .style('stroke-dasharray', '5 5');
    var usersData = makeUserData({ data: data, revealExtent: revealExtent });
    var trueLine = svg.append('g').attr('clip-path', 'url(.clip)');
    // background for d3 drag to work on.
    var background = dragCanvas({ svg: svg, width: width, height: height });
    if (!rawDraw) {
        // Draw the data's true line.
        trueLine
            .append('path')
            .attr('d', line(data))
            .style('stroke', 'black')
            .style('stroke-width', 3)
            .style('fill', 'none');
    }
    // plot the axes
    drawAxes({ svg: svg, scales: scales, height: height });
    var makeDragger = function (_a) {
        var scales = _a.scales, revealExtent = _a.revealExtent, rawDraw = _a.rawDraw;
        return d3
            .drag()
            .on('drag', function () {
            var pos = d3.mouse(this); // current drag position
            var drawStart = drawStartValue({
                // find the x value that we can start appending values at.
                usersData: usersData,
                revealExtent: revealExtent,
                rawDraw: rawDraw
            });
            // append drag point to closest point on x axis in the in data.
            addToClosest({
                usersData: usersData,
                xPos: clamp(drawStart, xMax, scales.x.invert(pos[0])),
                yPos: clamp(yMin, yMax, scales.y.invert(pos[1]))
            });
            // update the user's drawn line with the new data.
            userLine.attr('d', line.defined(function (d) { return d.defined; })(usersData));
            // if we've drawn for all the hidden datapoints, reveal them.
            if (d3.mean(usersData, function (d) { return d.defined; }) === 1 && !this.rawDraw) {
                clipRect.transition().duration(1000).attr('width', scales.x(xMax));
            }
        })
            .on('end', function () {
            onDoneDrawing(usersData);
        });
    };
    var dragger = makeDragger({ scales: scales, revealExtent: revealExtent, rawDraw: rawDraw });
    svg.call(dragger);
};
module.exports = DrawIt;
