// !preview r2d3 data = tibble(x = 1:10, y = sin(x)), options = list(x_range = c(0,10), y_range = c(0,10)), dependencies = c('d3-jetpack', here::here('inst/r2d3/drawr/helpers.js')),

const margin = {left: 45, right: 10, top: 20, bottom: 20};

let state = {
  data: data,
  svg: svg.append('g').translate([margin.left, margin.top]),
  width: width,
  w: width - margin.left - margin.right,
  height: height,
  h: height - margin.top - margin.bottom,
  options: options,
};




console.log('Initialized');
// To distinguish between code that runs at initialization-time only and
// code that runs when data changes, organize your code so that the code
// which responds to data changes is contained within the r2d3.onRender()
r2d3.onRender(function(data, svg, width, height, options) {
  state.data = data;
  state.options = options;

  const scales = setup_scales(state);
  scales.draw_x_axis(state.svg);
  scales.draw_y_axis(state.svg);
});

// Setup scales for visualization
function setup_scales(state){
  const {w, h, data} = state;
  const x = d3.scaleLinear()
      .domain(state.options.x_range || d3.extent(data, d => d.x))
      .range([0, w]);

  const y = d3.scaleLinear()
      .domain(state.options.y_range || d3.extent(data, d => d.y))
      .range([h, 0]);

  const draw_x_axis = g => g.append("g.x_axis")
    .translate([0, h])
    .call(d3.axisBottom().scale(x).ticks(5))
    .call(add_axis_label('X axis', y_axis = false));;

  const draw_y_axis = g => g.append("g.y_axis")
    .call(d3.axisLeft().scale(y))
    .call(add_axis_label('Y axis', y_axis = true));

  return {
    x,
    y,
    draw_x_axis,
    draw_y_axis,
  };
}

// An explicit resize handler
r2d3.onResize(function(width, height) {
  state.width = width;
  state.height = height;
  console.log('onResize!');
});
