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
