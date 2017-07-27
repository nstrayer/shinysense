const test = require('tape');
const MakeDrawnData = require('./MakeDrawnData');

const data = [
  {x: 2001, y: 31.4},
  {x: 2002, y: 32.6},
  {x: 2003, y: 34.5},
  {x: 2004, y: 35.5},
  {x: 2005, y: 35.6},
  {x: 2006, y: 35.3},
  {x: 2007, y: 35.2},
  {x: 2008, y: 39.3},
  {x: 2009, y: 52.3},
  {x: 2010, y: 60.9},
  {x: 2011, y: 65.9},
  {x: 2012, y: 70.4},
  {x: 2013, y: 72.6},
  {x: 2014, y: 74.4},
  {x: 2015, y: 73.6},
];

const timeData = [
  {x: new Date('08/05/1993 12:20:00'), y: 4},
  {x: new Date('09/15/1993 3:31:32'), y: 0},
  {x: new Date('09/15/1995 3:31:32'), y: 5},
  {x: new Date('09/15/1996 3:31:32'), y: 6},
  {x: new Date('09/15/1997 3:31:32'), y: 9},
  {x: new Date('09/15/1998 3:31:32'), y: 15},
  {x: new Date('09/15/1999 3:31:32'), y: 22},
];

test('test()', (t) => {
  t.deepEqual(
    MakeDrawnData({data, revealExtent: 2007, pinStart: true}),
    [
      {x: 2007, y: 35.2, defined: true},
      {x: 2008, y: 39.3, defined: false},
      {x: 2009, y: 52.3, defined: false},
      {x: 2010, y: 60.9, defined: false},
      {x: 2011, y: 65.9, defined: false},
      {x: 2012, y: 70.4, defined: false},
      {x: 2013, y: 72.6, defined: false},
      {x: 2014, y: 74.4, defined: false},
      {x: 2015, y: 73.6, defined: false},
    ],
    'Cuts away earlier data and pins first value.'
  );

  t.deepEqual(
    MakeDrawnData({data, revealExtent: 2000, pinStart: false}),
    [
      {x: 2001, y: 31.4, defined: false},
      {x: 2002, y: 32.6, defined: false},
      {x: 2003, y: 34.5, defined: false},
      {x: 2004, y: 35.5, defined: false},
      {x: 2005, y: 35.6, defined: false},
      {x: 2006, y: 35.3, defined: false},
      {x: 2007, y: 35.2, defined: false},
      {x: 2008, y: 39.3, defined: false},
      {x: 2009, y: 52.3, defined: false},
      {x: 2010, y: 60.9, defined: false},
      {x: 2011, y: 65.9, defined: false},
      {x: 2012, y: 70.4, defined: false},
      {x: 2013, y: 72.6, defined: false},
      {x: 2014, y: 74.4, defined: false},
      {x: 2015, y: 73.6, defined: false},
    ],
    'Works for freedraw'
  );

  t.deepEqual(
    MakeDrawnData({data, revealExtent: 2007, pinStart: false}),
    [
      {x: 2007, y: 35.2, defined: false},
      {x: 2008, y: 39.3, defined: false},
      {x: 2009, y: 52.3, defined: false},
      {x: 2010, y: 60.9, defined: false},
      {x: 2011, y: 65.9, defined: false},
      {x: 2012, y: 70.4, defined: false},
      {x: 2013, y: 72.6, defined: false},
      {x: 2014, y: 74.4, defined: false},
      {x: 2015, y: 73.6, defined: false},
    ],
    'different freedraw input.'
  );

  console.log('Time x check');

  t.deepEqual(
    MakeDrawnData({
      data: timeData,
      revealExtent: new Date('5/15/1995'),
      pinStart: true,
    }),
    [
      {x: new Date('09/15/1995 3:31:32'), y: 5, defined: true},
      {x: new Date('09/15/1996 3:31:32'), y: 6, defined: false},
      {x: new Date('09/15/1997 3:31:32'), y: 9, defined: false},
      {x: new Date('09/15/1998 3:31:32'), y: 15, defined: false},
      {x: new Date('09/15/1999 3:31:32'), y: 22, defined: false},
    ],
    'Pins first time value.'
  );

  t.deepEqual(
    MakeDrawnData({
      data: timeData,
      revealExtent: new Date('5/15/1995'),
      pinStart: false,
    }),
    [
      {x: new Date('09/15/1995 3:31:32'), y: 5, defined: false},
      {x: new Date('09/15/1996 3:31:32'), y: 6, defined: false},
      {x: new Date('09/15/1997 3:31:32'), y: 9, defined: false},
      {x: new Date('09/15/1998 3:31:32'), y: 15, defined: false},
      {x: new Date('09/15/1999 3:31:32'), y: 22, defined: false},
    ],
    'Doesnt first time value if in freedraw.'
  );
  t.end();
});
