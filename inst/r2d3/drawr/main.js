// !preview r2d3 data = tibble(x = 1:10, y = sin(x)), options = list(draw_start = 5.2, x_range = c(0,10), y_range = c(-5,5), line_style = list(stroke = 'orangered')), dependencies = c('d3-jetpack', here::here('inst/r2d3/drawr/helpers.js')),

const margin = {left: 45, right: 10, top: 20, bottom: 20};

const default_line_attrs = Object.assign({
  fill: "none",
  stroke: "steelblue",
  strokeWidth: 4,
  strokeLinejoin: "round",
  strokeLinecap: "round",
}, options.line_style);

let state = {
  data: data,
  svg: svg.append('g').translate([margin.left, margin.top]),
  width: width,
  w: width - margin.left - margin.right,
  height: height,
  h: height - margin.top - margin.bottom,
  options: options,
  drawn_points: [],
};


// To distinguish between code that runs at initialization-time only and
// code that runs when data changes, organize your code so that the code
// which responds to data changes is contained within the r2d3.onRender()
r2d3.onRender(function(data, svg, width, height, options) {
  const {before_draw, after_draw} = split_data(data, options.draw_start);
  state.data = data;
  state.before_draw = before_draw;
  state.after_draw = after_draw;
  state.options = options;

  const scales = setup_scales(state);
  scales.draw_x_axis(state.svg);
  scales.draw_y_axis(state.svg);

  // Draw visable portion of line
  state.svg.selectAppend("path.shown_line")
      .datum(state.data)
      .at(default_line_attrs)
      .attr("d", scales.line_drawer);

  // Cover hidden portion with a rectangle
  const line_hider = setup_line_hider(state.svg, state.options.draw_start, scales);

  line_hider.rect.on('click', () => line_hider.reveal());
});

function setup_line_hider(svg, draw_start, scales){
  // Cover hidden portion with a rectangle
  const start_pos = scales.x(draw_start);
  const rect_width = scales.x.range()[1] - start_pos + 5;
  const rect = svg.selectAppend('rect.line_hider')
    .at({
      x: scales.x(draw_start),
      height: scales.y.range()[0],
      width: rect_width,
      fill: 'grey',
    });

  const reveal = () => {
    rect
      .transition()
      .duration(2000)
      .translate([rect_width, 0]);
  };

  return {
    rect,
    reveal,
  }
}

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
    .call(add_axis_label('X axis', y_axis = false));

  const draw_y_axis = g => g.append("g.y_axis")
    .call(d3.axisLeft().scale(y))
    .call(add_axis_label('Y axis', y_axis = true));

  const line_drawer = d3.line()
    .x(d => x(d.x))
    .y(d => y(d.y));

  return {
    x,
    y,
    draw_x_axis,
    draw_y_axis,
    line_drawer,
  };
}


// An explicit resize handler
r2d3.onResize(function(width, height) {
  state.width = width;
  state.height = height;
  console.log('onResize!');
});
