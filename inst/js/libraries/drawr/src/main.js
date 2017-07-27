const d3 = require('d3');

const {
  simplifyData,
  appendSVG,
  makeScales,
  makeLine,
  makeClip,
  drawAxes,
  dragCanvas,
  makeUserData,
  clamp,
  addToClosest,
  drawStartValue,
} = require('./helpers');


const DrawIt = (params) => {
  const {
    data: fullData,
    domTarget,
    xKey,
    yKey,
    yDomain,
    revealExtent,
    totalHeight = 400,
    margin = {left: 50, right: 50, top: 30, bottom: 30},
    rawDraw = false, // does the user want to just draw with no data to show?
    onDoneDrawing = (d) => console.table(d),
  } = params;

  // grab a d3 selection of the div we're going to be putting out drawr in. 
  const sel = d3.select(domTarget).html('');
  // rename the x and y columns to x and y. 
  const data = simplifyData({fullData, xKey, yKey});
  // get actual viz height and width after accounting for the margins. 
  const totalWidth = sel.node().offsetWidth;
  const width = totalWidth - margin.left - margin.right;
  const height = totalHeight - margin.top - margin.bottom;
  // append an svg of the correct size to the div. 
  const svg = appendSVG({sel, totalHeight, totalWidth, margin});
  // extract the y axis desires.   
  const [yMin, yMax] = yDomain;
  const scales = makeScales({data, yDomain, height, width});
  const xMax = scales.xMax;
  const line = makeLine(scales);
  const clipRect = makeClip({svg, scales, revealExtent, height});

  // user's drawn data
  const userLine = svg
    .append('path')
    .style('stroke', 'steelblue')
    .style('stroke-width', 3)
    .style('stroke-dasharray', '5 5');

  let usersData = makeUserData({data, revealExtent});

  const trueLine = svg.append('g').attr('clip-path', 'url(.clip)');

  // background for d3 drag to work on.
  const background = dragCanvas({svg, width, height});

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
  drawAxes({svg, scales, height});

  const makeDragger = ({scales, revealExtent, rawDraw}) =>
    d3
      .drag()
      .on('drag', function() {
        const pos = d3.mouse(this); // current drag position
        const drawStart = drawStartValue({
          // find the x value that we can start appending values at.
          usersData,
          revealExtent,
          rawDraw,
        });

        // append drag point to closest point on x axis in the in data.
        addToClosest({
          usersData,
          xPos: clamp(drawStart, xMax, scales.x.invert(pos[0])),
          yPos: clamp(yMin, yMax, scales.y.invert(pos[1])),
        });

        // update the user's drawn line with the new data.
        userLine.attr('d', line.defined((d) => d.defined)(usersData));

        // if we've drawn for all the hidden datapoints, reveal them.
        if (d3.mean(usersData, (d) => d.defined) === 1 && !this.rawDraw) {
          clipRect.transition().duration(1000).attr('width', scales.x(xMax));
        }
      })
      .on('end', function() {
        onDoneDrawing(usersData);
      });

  const dragger = makeDragger({scales, revealExtent, rawDraw});
  svg.call(dragger);
};

module.exports = DrawIt;
