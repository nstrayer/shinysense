/**
 * Takes an array of objects along with two parameter key names and returns the array with keys renamed x and y 
 * @param {Object} config - Data simplification parameters. 
 * @param {Object[]} config.data - Array of objects. Standard d3 data format. 
 * @param {string} config.xKey - name of the x column
 * @param {string} config.yKey - name of the y column
 * @param {booleam} config.timeX - is the x axis a date and thus needs to be converted?
 * @return {Object[]} - Array of objects just as before but now with x and y as column names
 */
export function SimplifyData(config) {
  const {data, xKey, yKey, timeX} = config;
  return data.map((d) => {
    const {[xKey]: x, [yKey]: y, ...rest} = d;
    if (timeX) {
      return Object.assign(rest, {x: new Date(x), y});
    }
    return Object.assign(rest, {x, y});
  });
}
