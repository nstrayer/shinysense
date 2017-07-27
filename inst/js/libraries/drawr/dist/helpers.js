var d3 = require('d3');
// changes from whatever key the user has for x and y to just x and why for simplification of future manipulation
var simplifyData = function (_a) {
    var fullData = _a.fullData, xKey = _a.xKey, yKey = _a.yKey;
    return fullData.map(function (d) { return ({ x: d[xKey], y: d[yKey] }); });
};
var appendSVG = function (_a) {
    var sel = _a.sel, totalHeight = _a.totalHeight, totalWidth = _a.totalWidth, margin = _a.margin;
    return sel
        .append('svg')
        .attr('width', totalWidth)
        .attr('height', totalHeight)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
};
// spits out an object with the x and y scales along with a method for changing the range if the viz resizes. 
var makeScales = function (_a) {
    var data = _a.data, yDomain = _a.yDomain, height = _a.height, width = _a.width;
    var xExtents = d3.extent(data, function (d) { return d.x; });
    var x = d3
        .scaleLinear()
        .domain(xExtents);
    var y = d3.scaleLinear().domain(yDomain);
    var setRange = function (_a) {
        var newWidth = _a.width, newHeight = _a.height;
        // Based on the supplied sizes,
        // assign the range to x and y and domain to seconds
        x.range([0, newWidth]);
        y.range([newHeight, 0]);
    };
    // Size scales for initial use.
    setRange({ width: width, height: height });
    return { x: x, y: y, setRange: setRange, xMax: xExtents[1] };
};
var drawAxes = function (_a) {
    var svg = _a.svg, scales = _a.scales, height = _a.height;
    // Add the X Axis
    svg
        .append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(scales.x));
    // Add the Y Axis
    svg.append('g').call(d3.axisLeft(scales.y));
};
var makeLine = function (scales) {
    return d3.area().x(function (d) { return scales.x(d.x); }).y(function (d) { return scales.y(d.y); });
};
var makeClip = function (_a) {
    var svg = _a.svg, scales = _a.scales, revealExtent = _a.revealExtent, height = _a.height;
    return svg
        .append('clipPath')
        .attr('class', 'clipRect')
        .append('rect')
        .attr('width', scales.x(revealExtent))
        .attr('height', height);
};
var clamp = function (a, b, c) { return Math.max(a, Math.min(b, c)); };
var makeUserData = function (_a) {
    var data = _a.data, revealExtent = _a.revealExtent;
    return data
        .map(function (d) { return ({
        x: d.x,
        y: d.y,
        defined: d.x == revealExtent
    }); })
        .filter(function (d) { return d.x >= revealExtent; });
};
// append invisible rectangle covering plot so d3drag can see what's going on
var dragCanvas = function (_a) {
    var svg = _a.svg, width = _a.width, height = _a.height;
    return svg
        .append('rect')
        .attr('width', width)
        .attr('height', height)
        .attr('opacity', 0);
};
// takes user's current data and also the drag positions and returns a new userdata object with
// the closest point on the x-axis to the drag position changed to the drag position's y value.
var addToClosest = function (_a) {
    var usersData = _a.usersData, xPos = _a.xPos, yPos = _a.yPos;
    // make array of distance from drag xposition to x position in data
    // then find the index in that array that is the min. This is the closest point in our data.
    var closestIndex = usersData
        .map(function (d) { return Math.abs(d.x - xPos); })
        .reduce(function (minIndex, curVal, curIndex, arr) {
        return curVal < arr[minIndex] ? curIndex : minIndex;
    }, 0);
    // update user data info. The functional programmer in me is weeping at this, but it's way faster.
    usersData[closestIndex].y = yPos;
    usersData[closestIndex].defined = true;
};
// have to start user defined drawing one point after drawstart so that line is connected.
var drawStartValue = function (_a) {
    var usersData = _a.usersData, revealExtent = _a.revealExtent, rawDraw = _a.rawDraw;
    var startIndex = rawDraw
        ? usersData.map(function (d) { return d.x; }).indexOf(revealExtent)
        : usersData.map(function (d) { return d.x; }).indexOf(revealExtent) + 1;
    return usersData[startIndex].x;
};
module.exports = {
    simplifyData: simplifyData,
    appendSVG: appendSVG,
    makeScales: makeScales,
    makeLine: makeLine,
    makeClip: makeClip,
    drawAxes: drawAxes,
    makeUserData: makeUserData,
    dragCanvas: dragCanvas,
    clamp: clamp,
    addToClosest: addToClosest,
    drawStartValue: drawStartValue
};
