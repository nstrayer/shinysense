const d3 = require('d3');
const test = require('tape');
const {ChartSetup} = require('./ChartSetup');

test('ChartSetup()', (t) => {
  // append a div with id of viz for function to target
  d3.select('body').append('div').attr('id', 'viz');

  const myChart = ChartSetup({
    domTarget: '#viz',
    width: 500,
    height: 300,
    xDomain: [0, 100],
    yDomain: [100, 200],
    margin: {left: 50, right: 50, top: 50, bottom: 50},
  });

  const svg = d3.select('#viz').select('svg');

  t.deepEqual(
    Object.keys(myChart),
    ['svg', 'xScale', 'yScale', 'width', 'height', 'resize'],
    'returns the values and methods we expect.'
  );
  t.equal(+svg.attr('height'), 300, 'Svg is correct height');
  t.equal(+svg.attr('width'), 500, 'Svg is correct width');
  t.deepEqual(myChart.xScale.domain(), [0, 100], 'xScale domain is correct');
  t.deepEqual(
    myChart.xScale.range(),
    [0, 400],
    'xScale original range is correct'
  );
  t.deepEqual(myChart.yScale.domain(), [100, 200], 'yScale domain is correct');
  t.deepEqual(
    myChart.yScale.range(),
    [200, 0],
    'yScale original range is correct'
  );

  console.log('resizing chart');
  myChart.resize({width: 1000, height: 600});
  t.equal(+svg.attr('height'), 600, 'new svg height correct');
  t.equal(+svg.attr('width'), 1000, 'new svg width is correct');
  t.deepEqual(myChart.xScale.range(), [0, 900], 'new xScale range is correct');
  t.deepEqual(myChart.yScale.range(), [500, 0], 'new yScale range is correct');

  t.end();
});
