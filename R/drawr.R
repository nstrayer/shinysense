#' Drawr
#'
#' @param data Tibble to draw
#' @param x_col Name of column for x axis
#' @param y_col Name of column for y axis
#' @param draw_start Where on the x axis to start obscuring data for drawing?
#' @param title Text for title, if desired.
#' @param pin_start Pin start of drawn line to end of shown data? Defaults to `TRUE`.
#' @param x_range Two element array of min and max of x range. Otherwise defaults to min and max of data.
#' @param y_range Two element array of min and max of y range. Otherwise defaults to min and max of data.
#' @param line_style List containing any styling that is desired for the default line. For options see [MDN SVG line](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/line). Make sure to camelCase all attributes.
#' @param drawn_line_color CSS valid color for user-drawn line. Defaults to `"orangered"`.
#' @param data_line_color CSS valid color for data line. Defaults to `"steelblue"`.
#' @param x_axis_buffer Scaler for how much to pad ends of x axis if not specifying range directly. Defaults to 2% (`0.02`).
#' @param y_axis_buffer Scaler for how much to pad ends of y axis if not specifying range directly. Defaults to 10% (`0.1`).
#' @param shiny_message_loc A string containing the destination to target for shiny message passing. Used by `shinydrawr`, and can be ignored unless you're making your own shiny interface.
#'
#' @return Interactive you-draw-it plot.
#' @export
#'
#' @examples
#' drawr(data = dplyr::tibble(x = 1:50, y = sin(x)), x_col = x, y_col = y, title = 'My Drawr Chart', draw_start = 25)
drawr <- function(
  data,
  x_col,
  y_col,
  draw_start,
  title = NULL,
  pin_start = TRUE,
  x_range = NULL,
  y_range = NULL,
  line_style = NULL,
  drawn_line_color = 'orangered',
  data_line_color = 'steelblue',
  x_axis_buffer = 0.02,
  y_axis_buffer = 0.1,
  shiny_message_loc = NULL
){
  x_col_quo <- rlang::enquo(x_col)
  y_col_quo <- rlang::enquo(y_col)

  plot_data <- dplyr::select(data, x = !!x_col_quo, y = !!y_col_quo)

  x_min <- min(plot_data$x)
  x_max <- max(plot_data$x)
  x_buffer <- (x_max - x_min)*x_axis_buffer
  if(is.null(x_range)){
    x_range <- c(x_min - x_buffer, x_max + x_buffer)
  }

  y_min <- min(plot_data$y)
  y_max <- max(plot_data$y)
  y_buffer <- (y_max - y_min)*y_axis_buffer
  if(is.null(y_range)){
    y_range <- c(y_min - y_buffer, y_max + y_buffer)
  }

  # Make sure start point is in range
  if((draw_start <= x_min) | (draw_start >= x_max)){
    stop('Draw start is out of data range.')
  }

  r2d3::r2d3(
    plot_data,
    system.file("r2d3/drawr/main.js", package = "shinysense"),
    dependencies = c('d3-jetpack'),
    options = list(
      draw_start = draw_start,
      pin_start = pin_start,
      x_range = x_range,
      y_range = y_range,
      x_name = rlang::as_name(x_col_quo),
      y_name = rlang::as_name(y_col_quo),
      line_style = line_style,
      data_line_color = data_line_color,
      drawn_line_color = drawn_line_color,
      title = title,
      shiny_message_loc = shiny_message_loc
    )
  )
}
