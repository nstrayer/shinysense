/**
 * Passed a d3 selection of a div and returns important info on it like width height and a resize watcher.  
 * @param {string} domTarget - Id of the div visualization is going into. With prepended '#'. 
 * @return {Object} ChartSizeObject - Object with useful information about chart size. 
 *  Contains .width .height and a setter function to place a function that gets passed new width and height in that order on resize.
 */
function GetContainerSize(selection) {
  const width = selection.node().offsetWidth;
  const height = selection.node().offsetHeight;
  const setResizeFunc = (fun) => {
    window.addEventListener('resize', () => {
      const newWidth = selection.node().offsetWidth;
      const newHeight = selection.node().offsetHeight;
      fun(newWidth, newHeight);
    });
  };
  return {
    width,
    height,
    setResizeFunc,
  };
}

module.exports = GetContainerSize;
