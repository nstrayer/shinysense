/**
 * takes a some current data and also drag positions mutates data in place with drag coordinates. 
 * @param {Object} config - Object containing info about data and drag position.
 * @param {Object[]} config.usersData - array of data with fields x y and defined. 
 * @param {number} config.xPos - cursor x position in data scale
 * @param {number} config.yPos - cursor y position in data scale
 * @param {boolean} config.freeDraw - Are we freedrawing? If not pin first value.
 */
function AddDrawnData(config) {
  const {userData, xPos, yPos, freeDraw} = config;
  // make array of distance from drag xposition to x position in data
  // then find the index in that array that is the min. This is the closest point in our data.
  const closestIndex = userData
    .map((d) => Math.abs(d.x - xPos))
    .reduce(
      (minIndex, curVal, index, arr) =>
        curVal < arr[minIndex] ? index : minIndex,
      0
    );

  // update user data info. The functional programmer in me is weeping at this, but it's way faster.
  const pinnedValue = !freeDraw && closestIndex === 0;
  if (!pinnedValue) {
    userData[closestIndex].y = yPos;
  }
  userData[closestIndex].defined = true;
}

module.exports = AddDrawnData;
