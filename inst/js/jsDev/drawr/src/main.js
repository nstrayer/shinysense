const d3 = require('d3');
const {ChartSetup} = require('./ChartSetup');
const {SimplifyData} = require('./SimplifyData');
const MakeDrawnData = require('./MakeDrawnData');
const MakeDragger = require('./MakeDragger');
const AddDrawnData = require('./AddDrawnData');
const MakelineGenerator = require('./MakelineGenerator');

/**
 * Creates a simple drawer d3 chart. 
 * @param {Object} config - Object containing info about your environment/ data.
 * @param {Object[]} config.data - data to be plotted: array of objects
 * @param {string} config.xKey - name of the x column in data objects
 * @param {string} config.yKey - name of the y column in data objects
 * @param {boolean} [config.timeX = false] - Is the x-axis of the data in time format? If so use MM-dd-YYYY HH:MM:SS please!
 * @param {function} [config.onDoneDrawing = (drawn) => console.log(drawn)] - function called after user has finished drawing on chart. Is passed the draw data.
 * @param {string} config.domTarget - name (with # prefix) of the div you're chart is going in
 * @param {boolean} config.freeDraw - Are we just using this as a drawer and no reveal?
 * @param {number} [config.revealExtent = null] - Point at which we start keeping data x >= revealExtent.
 * @param {number} [config.height = 400] - height in pixels of viz
 * @param {number} [config.width = 400] - width in pixels of viz
 * @param {string} [drawLineColor = 'steelblue'] - valid css color for the user drawn line. 
 * @return {function} a resize function that allows you to resize the whole viz. 
 */
function drawr(config) {
  const {
    domTarget,
    data: originalData,
    xKey = 'x',
    yKey = 'y',
    yMin,
    yMax,
    timeX = false,
    onDoneDrawing = (drawn) => console.log(drawn),
    freeDraw = false,
    height: chartHeight = 400,
    width: chartWidth = 400,
    margin = {left: 50, right: 50, top: 50, bottom: 50},
    drawLineColor = 'steelblue',
  } = config;

  let {revealExtent = null} = config;

  let clipRect; // Define the clip rectangle holder so it isn't hidden in the if freeDraw scope.
  let dataLine;
  let allDrawn; // Boolean recording if we've drawn all the values already. Used to trigger reveal animation.

  const data = SimplifyData({
    data: originalData,
    xKey,
    yKey,
    timeX,
  });

  const xDomain = d3.extent(data, (d) => d.x);
  const yDomain = d3.extent(data, (d) => d.y);

  // Javascript sees 0 as falsy, but we also want to have that be an options for setting the axis values. 
  const valueExists = (val) => {
    if (val === 0) return true;
    return val;
  };

  if (valueExists(yMin)) yDomain[0] = yMin;
  if (valueExists(yMax)) yDomain[1] = yMax;

  const {svg, xScale, yScale, resize: chartResize} = ChartSetup({
    domTarget,
    width: chartWidth,
    height: chartHeight,
    xDomain,
    yDomain,
    timeX,
    margin,
  });

  // If we're doing a freedraw we need to set the clipping just before our data starts.
  if (freeDraw) {
    revealExtent = xDomain[0] - 1e-6;
  }
  // If our chart has a time axes we need to convert the reveal extent do a date object too.
  if (timeX) {
    revealExtent = new Date(revealExtent);
  }

  const dataLineGen = MakelineGenerator({
    xScale,
    yScale,
    definedFunc: (d) => {
      const NanOrNull = isNaN(d.y) || d.y === null;
      return !NanOrNull;
    },
  });
  const userLineGen = MakelineGenerator({
    xScale,
    yScale,
    definedFunc: (d) => d.defined,
  });

  // set up environment for the drawn line to sit in.
  const userLine = svg
    .append('path')
    .attr('class', 'user_line')
    .style('stroke', drawLineColor)
    .style('stroke-width', 3)
    .style('stroke-dasharray', '5 5');

  // Dont pin the first value to the existing y data unless the user has selected freedraw
  const userData = MakeDrawnData({data, revealExtent, pinStart: !freeDraw});

  // Make invisible rectangle over whole viz for the d3 drag behavior to watch
  const dragCanvas = svg
    .append('rect')
    .attr('class', 'drag_canvas')
    .attr('width', chartWidth)
    .attr('height', chartHeight)
    .attr('opacity', 0);

  // set up a clipping rectangle for the viz. Only needed if we're showing some data.
  if (!freeDraw && revealExtent) {
    clipRect = svg
      .append('clipPath')
      .attr('id', `${domTarget.replace('#', '')}_clipper`) // need unique clip id or we get colisions between multiple drawrs.
      .append('rect')
      .attr('width', xScale(revealExtent))
      .attr('y', -margin.top)
      .attr('height', chartHeight);

    // set up a holder to draw the true line with that is clipped by our clip rectangle we just made
    dataLine = svg
      .append('g')
      .attr('class', 'data_line')
      .attr('clip-path', `url(${domTarget}_clipper)`)
      .append('path')
      .attr('d', dataLineGen(data))
      .style('stroke', 'black')
      .style('stroke-width', 3)
      .style('fill', 'none');
  }

  const updateUserLine = () => userLine.attr('d', userLineGen(userData));

  const resizeViz = ({width: newWidth, height: newHeight}) => {
    // resize base chart.
    chartResize({width: newWidth, height: newHeight});

    // resize the dragging canvas and lines.
    if (!freeDraw && revealExtent) {
      clipRect
        .attr('width', allDrawn ? xScale(xDomain[1]) : xScale(revealExtent))
        .attr('height', newHeight);
      dataLine.attr('d', dataLineGen(data));
    }
    dragCanvas.attr('width', newWidth).attr('height', newHeight);
    updateUserLine();
  };

  const onDrag = (xPos, yPos) => {
    // Update the drawn line with the latest position.
    AddDrawnData({userData, xPos, yPos, freeDraw});
    updateUserLine();
    // if we've drawn for all the hidden datapoints, reveal them.
    allDrawn = d3.mean(userData, (d) => d.defined) === 1;

    if (allDrawn && !freeDraw) {
      clipRect.transition().duration(1000).attr('width', xScale(xDomain[1]));
    }
  };

  const onDragEnd = () => {
    if (allDrawn) {
      onDoneDrawing(userData);
    }
  };

  const dragger = MakeDragger({
    xScale,
    yScale,
    revealExtent,
    onDrag,
    onDragEnd,
  });

  svg.call(dragger);

  return {resize: resizeViz};
}

module.exports = drawr;
