const d3 = require('d3');

// changes from whatever key the user has for x and y to just x and why for simplification of future manipulation
const simplifyData = ({fullData, xKey, yKey}) =>
  fullData.map((d) => ({x: d[xKey], y: d[yKey]}));

const appendSVG = ({sel, totalHeight, totalWidth, margin}) =>
  sel
    .append('svg')
    .attr('width', totalWidth)
    .attr('height', totalHeight)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// spits out an object with the x and y scales along with a method for changing the range if the viz resizes. 
const makeScales = ({data, yDomain, height, width}) => {
  const xExtents = d3.extent(data, (d) => d.x);

  let x = d3
    .scaleLinear()
    .domain(xExtents);

  let y = d3.scaleLinear().domain(yDomain);

  const setRange = ({width: newWidth, height: newHeight}) => {
    // Based on the supplied sizes,
    // assign the range to x and y and domain to seconds
    x.range([0, newWidth]);
    y.range([newHeight, 0]);
  };

  // Size scales for initial use.
  setRange({width, height});

  return {x, y, setRange, xMax: xExtents[1]};
};

const drawAxes = ({svg, scales, height}) => {
  x
};

const makeLine = (scales) =>
  d3.area().x((d) => scales.x(d.x)).y((d) => scales.y(d.y));

const makeClip = ({svg, scales, revealExtent, height}) =>
  svg
    .append('clipPath')
    .attr('class', 'clipRect')
    .append('rect')
    .attr('width', scales.x(revealExtent) )
    .attr('height', height);

const clamp = (a, b, c) => Math.max(a, Math.min(b, c));

const makeUserData = ({data, revealExtent}) =>
  data
    .map((d) => ({
      x: d.x,
      y: d.y,
      defined: d.x == revealExtent,
    }))
    .filter((d) => d.x >= revealExtent);

// append invisible rectangle covering plot so d3drag can see what's going on
const dragCanvas = ({svg, width, height}) =>
  svg
    .append('rect')
    .attr('width', width)
    .attr('height', height)
    .attr('opacity', 0);

// takes user's current data and also the drag positions and returns a new userdata object with
// the closest point on the x-axis to the drag position changed to the drag position's y value.
const addToClosest = ({usersData, xPos, yPos}) => {
  // make array of distance from drag xposition to x position in data
  // then find the index in that array that is the min. This is the closest point in our data.
  const closestIndex = usersData
    .map((d) => Math.abs(d.x - xPos))
    .reduce(
      (minIndex, curVal, curIndex, arr) =>
        curVal < arr[minIndex] ? curIndex : minIndex,
      0
    );

  // update user data info. The functional programmer in me is weeping at this, but it's way faster.
  usersData[closestIndex].y = yPos;
  usersData[closestIndex].defined = true;
};

// have to start user defined drawing one point after drawstart so that line is connected.
const drawStartValue = ({usersData, revealExtent, rawDraw}) => {
  const startIndex = rawDraw
    ? usersData.map((d) => d.x).indexOf(revealExtent)
    : usersData.map((d) => d.x).indexOf(revealExtent) + 1;
  return usersData[startIndex].x;
};

module.exports = {
  simplifyData,
  appendSVG,
  makeScales,
  makeLine,
  makeClip,
  drawAxes,
  makeUserData,
  dragCanvas,
  clamp,
  addToClosest,
  drawStartValue,
};
