const d3 = require('d3');
const test = require('tape');
const drawr = require('./main');

const data = [
    {time: '05/15/2014 10:15:41', pig: 40, chicken: 40},
    {time: '08/05/1993 12:20:00', pig: 50, chicken: 20},
    {time: '09/15/1993 3:31:32', pig: 0, chicken: 90},
    {time: '03/14/2015 9:26:00', pig: 23, chicken: 3},
  ];

// set up div for viz with clip
d3.select('body').append('div').attr('id', 'viz');

test('drawr() on freedraw mode', (t) => {
  const myDrawr = drawr({
    domTarget: '#viz',
    timeX: true,
    data,
    freeDraw: false,
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

  console.log('Resizing');
  myDrawr.resize({width: 500, height: 300});
  t.equal(+svg.attr('height'), 300, 'Svg is correct height');
  t.equal(+svg.attr('width'), 500, 'Svg is correct width');


  t.end();
});
