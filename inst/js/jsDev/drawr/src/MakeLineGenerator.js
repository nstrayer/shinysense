const d3 = require('d3');

/**
 * Wraps the d3.area function for easier definition of defined.  
 * @param {Object} config - Configurations for the function. 
 * @param {function} config.xScale - scale for x axis
 * @param {function} config.yScale - scale for y axis
 * @param {function} config.definedFunc - function that takes each points data object and decides if it should draw it or not. 
 * @return {function} A d3 area line generator ready to plug into the d path of our chart. 
 */
function MakeLineGenerator(config) {
  const {xScale, yScale, definedFunc} = config;
  return d3.area().x((d) => xScale(d.x)).y((d) => yScale(d.y)).defined(definedFunc);
}

module.exports = MakeLineGenerator;
