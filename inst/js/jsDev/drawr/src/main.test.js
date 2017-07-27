const d3 = require('d3');
const test = require('tape');
const drawr = require('./main');

const data = [
  {year: 2001, debt: 31.4},
  {year: 2002, debt: 32.6},
  {year: 2003, debt: 34.5},
  {year: 2004, debt: 35.5},
  {year: 2005, debt: 35.6},
  {year: 2006, debt: 35.3},
  {year: 2007, debt: 35.2},
  {year: 2008, debt: 39.3},
  {year: 2009, debt: 52.3},
  {year: 2010, debt: 60.9},
  {year: 2011, debt: 65.9},
  {year: 2012, debt: 70.4},
  {year: 2013, debt: 72.6},
  {year: 2014, debt: 74.4},
  {year: 2015, debt: 73.6},
];

// set up div for viz with clip
d3.select('body').append('div').attr('id', 'viz');

test('drawr()', (t) => {
  const myDrawr = drawr({
    domTarget: '#viz',
    data,
    revealExtent: 2008,
    width: 500,
    height: 400,
  });

  const svg = d3.select('#viz').select('svg');

  t.equal(+svg.attr('height'), 400, 'Svg is correct height');
  t.equal(+svg.attr('width'), 500, 'Svg is correct width');
  t.assert(
    !svg.select('.user_line').empty(),
    'A g element has been added for the user drawn line'
  );

  const dragCanvas = svg.select('.drag_canvas');
  t.assert(
    !dragCanvas.empty(),
    'A rectangle convering the background of the viz has been added.'
  );
  t.equal(
    +dragCanvas.attr('width'),
    500,
    'dragging canvas is as wide as the viz.'
  );
  t.equal(
    +dragCanvas.attr('height'),
    400,
    'dragging canvas is as tall as the viz.'
  );

  console.log('Clip rectangle stuff');
  const clipPath = svg.select('clipPath');
  t.assert(!clipPath.empty(), 'A clip path is appended.');
  t.assert(!svg.select('.data_line').empty(), 'Holder for true data line appended');

  console.log('Resizing');
  myDrawr.resize({width: 500, height: 300});
  t.equal(+svg.attr('height'), 300, 'Svg is correct height');
  t.equal(+svg.attr('width'), 500, 'Svg is correct width');

  t.end();
});
