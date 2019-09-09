// !preview r2d3 data = tibble(x = 1:50, y = sin(x)), options = list(draw_start = 0, pin_start = FALSE, x_range = c(0,50), y_range = c(-5,5), line_style = list(strokeWidth = 4), data_line_color = 'steelblue', drawn_line_color = 'orangered', x_name = 'my_x_col', y_name = 'my_y_col'), dependencies = c('d3-jetpack'),

const margin = {left: 50, right: 10, top: 20, bottom: 20};

const default_line_attrs = Object.assign({
  fill: "none",
  stroke: options.data_line_color || 'steelblue',
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

  // Are we drawing real data to reveal?
  state.reveal_line = state.data[0].y !== undefined;

  start_drawer(state);
});

// An explicit resize handler
r2d3.onResize(function(width, height) {
  state.w = width - margin.left - margin.right;
  state.h = height - margin.top - margin.bottom;

  start_drawer(state, reset = false);
});


// Main function that draws current state of viz
function start_drawer(state, reset = true){
  const scales = setup_scales(state);

  if(state.reveal_line){
    draw_true_line(state, scales);
  }

  // Cover hidden portion with a rectangle
  const line_hider = setup_line_hider(state.svg, state.options.draw_start, scales);

  if(reset){
    state.drawable_points = setup_drawable_points(state);
  }

  draw_user_line(state, scales);

  const on_drag = function(){
    const drag_x = scales.x.invert(d3.event.x);
    const drag_y = scales.y.invert(d3.event.y);
    fill_in_closest_point(state, drag_x, drag_y);
    draw_user_line(state, scales);
  };

  const on_end = function(){
    // Check if all points are drawn so we can reveal line
    const line_status = get_user_line_status(state.drawable_points, state.reveal_line);

    if(line_status === 'finished'){
      // User has completed line drawing

      if(state.reveal_line)  line_hider.reveal();
    }
  };

  setup_draw_watcher(state.svg, scales, on_drag, on_end);
}

function setup_drawable_points(state){

  if(state.reveal_line){
    return state.data
      .filter(d => d.x >= state.options.draw_start)
      .map((d,i) => ({
        x: d.x,
        y: i === 0 ? d.y: null
      }));
   } else {
     return state.data.map(d => ({x: d.x, y: null}));
   }

}

function get_user_line_status(drawable_points, reveal_line){
  const num_points = drawable_points.length;
  const num_filled = d3.sum(drawable_points.map(d => d.y === null ? 0: 1));
  const num_starting_filled = reveal_line ? 1: 0;
  if(num_filled === num_starting_filled){
    return 'unstarted';
  } else if(num_points === num_filled){
    return 'finished';
  } else {
    return 'in_progress';
  }
}

function draw_true_line({svg, data}, scales){
  // Draw visable portion of line
  state.svg.selectAppend("path.shown_line")
      .datum(data)
      .at(default_line_attrs)
      .attr("d", scales.line_drawer);
}

function draw_user_line({svg, drawable_points, options}, scales){
  const user_line = state.svg.selectAppend("path.user_line");

  // Only draw line if there's something to draw.
  if(get_user_line_status(drawable_points, state.reveal_line) === 'unstarted'){
    user_line.remove();
    return;
  }

  // Draw user hidden line
  user_line
      .datum(drawable_points)
      .at(default_line_attrs)
      .attr('stroke', options.drawn_line_color)
      .attr("d", scales.line_drawer);
}

function fill_in_closest_point({drawable_points, options}, drag_x, drag_y){
   // find closest point on data to draw
  let last_dist = Infinity;
  let current_dist;
  // If nothing triggers break statement than closest point is last point
  let closest_index = drawable_points.length - 1;
  let i = options.pin_start ? 1: 0;
  for(; i < drawable_points.length; i++){
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

function setup_draw_watcher(svg, scales, on_drag, on_end){

  svg.selectAppend('rect.drag_watcher')
    .at({
      height: scales.y.range()[0],
      width: scales.x.range()[1],
      fill: 'grey',
      fillOpacity: 0,
    })
    .call(
      d3.drag()
        .on("drag", on_drag)
        .on("end", on_end)
    );
}

function setup_line_hider(svg, draw_start, scales){
  // Cover hidden portion with a rectangle
  const start_pos = scales.x(draw_start);
  const rect_width = scales.x.range()[1] - start_pos + 5;
  const covering_all_data = scales.x(draw_start) === scales.x.range()[0];
  const rect = svg.selectAppend('rect.line_hider')
    .at({
      x: scales.x(draw_start) + (covering_all_data ? 2: 0),
      height: scales.y.range()[0],
      width: rect_width,
      fill: 'white',
    });

  const reset = () => {
     rect
      .translate([0,0])
      .attr('fill-opacity', 1)
      .classed('hidden', false);
  };

  const reveal = () => {
    rect
      .transition()
      .duration(2000)
      .translate([rect_width, 0])
      .transition()
      .duration(0)
      .attr('fill-opacity', 0)
      .attr('classed', 'hidden');
  };

  return {
    rect,
    reveal,
    reset,
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
  const {w, h, data, options} = state;

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
    .call(add_axis_label(options.x_name, y_axis = false));

  // Draw y axis
  state.svg.selectAppend("g.y_axis")
    .call(d3.axisLeft().scale(y))
    .call(add_axis_label(options.y_name, y_axis = true));

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

