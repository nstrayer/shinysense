const {SimplifyData} = require('./SimplifyData');
const test = require('tape');

test('SimplifyData()', (t) => {
  // append a div with id of viz for function to target
  const fakeData = [
    {horse: 93, pig: 40, chicken: 40},
    {horse: 43, pig: 50, chicken: 20},
    {horse: 5, pig: 0, chicken: 90},
    {horse: 23, pig: 23, chicken: 3},
  ];

  t.deepEqual(
    SimplifyData({data: fakeData, xKey: 'horse', yKey: 'pig'}),
    [
      {x: 93, y: 40, chicken: 40},
      {x: 43, y: 50, chicken: 20},
      {x: 5, y: 0, chicken: 90},
      {x: 23, y: 23, chicken: 3},
    ],
    'properly fixes data'
  );

  t.deepEqual(
    fakeData,
    [
      {horse: 93, pig: 40, chicken: 40},
      {horse: 43, pig: 50, chicken: 20},
      {horse: 5, pig: 0, chicken: 90},
      {horse: 23, pig: 23, chicken: 3},
    ],
    'didnt mutate original data'
  );

  console.log('Time X axis');
  const timeData = [
    {time: '05/15/2014 10:15:41', pig: 40, chicken: 40},
    {time: '08/05/1993 12:20:00', pig: 50, chicken: 20},
    {time: '09/15/1993 3:31:32', pig: 0, chicken: 90},
    {time: '03/14/2015 9:26:00', pig: 23, chicken: 3},
  ];

  const parsedTimeData = SimplifyData({
    data: timeData,
    xKey: 'time',
    yKey: 'pig',
    timeX: true,
  });
  t.equal(parsedTimeData[1].x.getHours(), 12, 'gets proper hours from dates');
  t.equal(
    parsedTimeData[3].x.getMinutes(),
    26,
    'gets proper minutes from dates'
  );

  t.end();
});
