const d3 = require('d3');

const clamp = (a, b, c) => Math.max(a, Math.min(b, c));

/**
 * A helper that gets passed some basic information about your chart, appends an svg and a centered g using margin conventions.
 * @param {Object} config - Object containing info about your environment/ data.
 * @param {function} config.xScale - d3 scale function for x axis
 * @param {function} config.yScale - d3 scale function for y axis
 * @param {number} config.revealExtent - x value for lowest value we'll allow to be drawn in data. 
 * @param {function} config.onDrag - function that gets supplied the x and y positions in data terms onDrag(x,y);
 * @param {function} config.onDragEnd - function that gets called when the dragging is finished. No arguments.
 */
function MakeDragger(config) {
  const {xScale, yScale, revealExtent: xMin, onDrag, onDragEnd} = config;
  const xMax = xScale.domain()[1];
  const yMax = yScale.domain()[1];
  const yMin = yScale.domain()[0];

  return d3
    .drag()
    .on('drag', function() {
      const dragPos = d3.mouse(this); // current drag position
      const drawnX = clamp(xMin, xMax, xScale.invert(dragPos[0]));
      const drawnY = clamp(yMin, yMax, yScale.invert(dragPos[1]));

      // Send drag info to the user's supplied function. 
      onDrag(drawnX, drawnY);
    })
    .on('end', function() {
      onDragEnd();
    });
}

module.exports = MakeDragger;
