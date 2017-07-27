const d3 = require('d3');
const test = require('tape');
const GetContainerSize = require('./GetContainerSize');


test('GetContainerSize()', (t) => {
  d3
    .select('body')
    .append('div')
    .attr('id', 'viz')
    .style('height', '200px')
    .style('width', '500px');

  const chartSize = GetContainerSize(d3.select('#viz'));

  t.assert(
    chartSize.width,
    'Can get a width'
  );

  t.assert(
    chartSize.height,
    'Can get a height'
  );
  t.end();
});
