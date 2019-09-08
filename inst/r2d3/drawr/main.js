// !preview r2d3 data = tibble(x = 1:20, y = sin(x)), options = list(draw_start = 10, x_range = c(0,20), y_range = c(-5,5), line_style = list(stroke = 'orangered')), dependencies = c('d3-jetpack', here::here('inst/r2d3/drawr/helpers.js')),

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
  w: width - margin.left - margin.right,
  h: height - margin.top - margin.bottom,
  options: options,
};


// To distinguish between code that runs at initialization-time only and
// code that runs when data changes, organize your code so that the code
// which responds to data changes is contained within the r2d3.onRender()
r2d3.onRender(function(data, svg, width, height, options) {
  state.data = data;
  state.options = options;
  state.drawable_points = state.data
    .filter(d => d.x >= state.options.draw_start)
    .map((d,i) => ({x: d.x, y: i === 0 ? d.y: null})); // Keep first point pinned

  start_drawer(state);
});

// An explicit resize handler
r2d3.onResize(function(width, height) {
  state.w = width - margin.left - margin.right;
  state.h = height - margin.top - margin.bottom;

  start_drawer(state);
});


// Main function that draws current state of viz
function start_drawer(state){
  const scales = setup_scales(state);

  draw_true_line(state, scales);

  // Cover hidden portion with a rectangle
  const line_hider = setup_line_hider(state.svg, state.options.draw_start, scales);

  draw_user_line(state, scales);

  const on_drag = function(){
    const drag_x = scales.x.invert(d3.event.x);
    const drag_y = scales.y.invert(d3.event.y);
    fill_in_closest_point(state.drawable_points, drag_x, drag_y);
    draw_user_line(state, scales);
    // Check if all points are drawn so we can reveal line
    const num_unfilled = d3.sum(state.drawable_points.map(d => d.y === null ? 1: 0));
    if(num_unfilled === 0){
      line_hider.reveal();
    }
  };

  setup_draw_watcher(state.svg, scales, on_drag);
}

function draw_true_line({svg, data}, scales){
  // Draw visable portion of line
  state.svg.selectAppend("path.shown_line")
      .datum(data)
      .at(default_line_attrs)
      .attr("d", scales.line_drawer);
}

function draw_user_line({svg, drawable_points}, scales){
  // Draw user hidden line
  state.svg.selectAppend("path.user_line")
      .datum(drawable_points)
      .at(default_line_attrs)
      .attr('stroke', 'steelblue')
      .attr("d", scales.line_drawer);
}

function fill_in_closest_point(drawable_points, drag_x, drag_y){
   // find closest point on data to draw
  let last_dist = Infinity;
  let current_dist;
  // If nothing triggers break statement than closest point is last point
  let closest_index = drawable_points.length - 1;
  for(let i = 1; i < drawable_points.length; i++){
    current_dist = Math.abs(drawable_points[i].x - drag_x);
    // If distances start going up we've passed the closest point
    if(last_dist - current_dist < 0) {
      closest_index = i - 1;
      break;
    }
    last_dist = current_dist;
  }

  drawable_points[closest_index].y = drag_y;
}

function setup_draw_watcher(svg, scales, on_drag){

  svg.selectAppend('rect.drag_watcher')
    .at({
      height: scales.y.range()[0],
      width: scales.x.range()[1],
      fill: 'grey',
      fillOpacity: 0.3,
    })
    .call(d3.drag().on("drag", on_drag));
}

function setup_line_hider(svg, draw_start, scales){
  // Cover hidden portion with a rectangle
  const start_pos = scales.x(draw_start);
  const rect_width = scales.x.range()[1] - start_pos + 5;
  const rect = svg.selectAppend('rect.line_hider')
    .at({
      x: scales.x(draw_start),
      height: scales.y.range()[0],
      width: rect_width,
      fill: 'white',
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

function add_axis_label(label, y_axis = true){

  const bump_axis = y_axis ? 'y': 'x';

  const axis_label_style = {
    [bump_axis]: -2,
    textAnchor: 'end',
    fontWeight: '500',
    fontSize: '0.8rem',
    fill: 'dimgrey',
  };

  return g => {
    let last_tick = g.select(".tick:last-of-type");
    const no_ticks = last_tick.empty();

    if(no_ticks){
      last_tick = g.append('g')
        .attr('class', 'tick');
    }

    last_tick.select("line").remove();

    last_tick.selectAppend("text")
            .at(axis_label_style)
            .html(label);
  };
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

  // Draw x axis
  state.svg.selectAppend("g.x_axis")
    .translate([0, h])
    .call(d3.axisBottom().scale(x).ticks(5))
    .call(add_axis_label('X axis', y_axis = false));

  // Draw y axis
  state.svg.selectAppend("g.y_axis")
    .call(d3.axisLeft().scale(y))
    .call(add_axis_label('Y axis', y_axis = true));

  const line_drawer = d3.line()
    .defined(d => d.y !== null)
    .x(d => x(d.x))
    .y(d => y(d.y));

  return {
    x,
    y,
    line_drawer,
  };
}

