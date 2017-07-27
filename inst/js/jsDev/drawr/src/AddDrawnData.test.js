const test = require('tape');
const AddDrawnData = require('./AddDrawnData');

const userData = [
  {x: 2007, y: 35.2, defined: true},
  {x: 2008, y: 39.3, defined: false},
  {x: 2009, y: 52.3, defined: false},
  {x: 2010, y: 60.9, defined: false},
  {x: 2011, y: 65.9, defined: false},
  {x: 2012, y: 70.4, defined: false},
  {x: 2013, y: 72.6, defined: false},
  {x: 2014, y: 74.4, defined: false},
  {x: 2015, y: 73.6, defined: false},
];

test('AddDrawnData()', (t) => {
  t.equal(userData[3].y, 60.9, 'Starts data in right place');
  t.equal(userData[3].defined, false, 'Starts undefined');

  AddDrawnData({userData, xPos: 2010.2, yPos: 200, freeDraw: false});
  t.equal(userData[3].y, 200, 'Modifies nearest y in place.');
  t.equal(userData[3].defined, true, 'Sets as defined');

  AddDrawnData({userData, xPos: 2000.83, yPos: -130, freeDraw: true});
  t.equal(userData[0].y, -130, 'Modifies another y in place.');

  t.end();
});
