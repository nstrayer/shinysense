/**
 * Takes data and a drawing extent and spits out data with x's greater than the drawing extent.  
 * @param {Object} config - Configurations for the function. 
 * @param {Object[]} config.data - array of objects with keys x and y.  
 * @param {number} config.revealExtent - Point at which we start keeping data x >= revealExtent.
 * @param {boolean} [config.pinStart = true] - Do we keep the first value pinned at the original data? No means line can start anywhere. Useful for freedrawing.
 * @return {Object[]} A subset (but perhaps equal sized) array of data with a defined field added. 
 */
function MakeDrawnData(config) {
  const {data, revealExtent, pinStart} = config;
  return data
    .filter((d) => d.x >= revealExtent)
    .map((d, i) => ({
      x: d.x,
      y: d.y,
      defined: pinStart && i === 0? true: false,
    }));
}

module.exports = MakeDrawnData;
