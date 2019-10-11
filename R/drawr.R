#' Display a lineplot that lets user's draw data: Widget version
#'
#' Makes a static you-draw-it chart that can go into an rmarkdown or work as a
#' standalone html plot. Inspired by the New York Times article
#' \href{https://www.nytimes.com/interactive/2015/05/28/upshot/you-draw-it-how-family-income-affects-childrens-college-chances.html}{You
#' Draw It: How Family Income Predicts Children’s College}
#'
#' @seealso \code{\link{shinydrawr}}
#' @param data Tibble to draw
#' @param x_col Name of column for x axis
#' @param y_col Name of column for y axis
#' @param free_draw Do you just want the user to draw data on a supplied
#'   x-range? I.e. no revealed line?
#' @param draw_start Where on the x axis to start obscuring data for drawing?
#'   Defaults to very start of data.
#' @param title Text for title, if desired.
#' @param pin_start Pin start of drawn line to end of shown data? Defaults to
#'   \code{TRUE}.
#' @param x_range Two element array of min and max of x range. Otherwise
#'   defaults to min and max of data.
#' @param y_range Two element array of min and max of y range. Otherwise
#'   defaults to min and max of data.
#' @param x_lab Text to label x axis, defaults to name of column used for x-axis
#' @param y_lab Text to label y axis, defaults to name of column, or in
#'   free-draw case, to just \code{'y'}.
#' @param line_style List containing any styling that is desired for the default
#'   line. For options see
#'   \href{https://developer.mozilla.org/en-US/docs/Web/SVG/Element/line}{MDN:
#'   SVG line}. Make sure to camelCase all attributes.
#' @param drawn_line_color CSS valid color for user-drawn line. Defaults to
#'   \code{"orangered"}.
#' @param data_line_color CSS valid color for data line. Defaults to
#'   \code{"steelblue"}.
#' @param x_axis_buffer Scaler for how much to pad ends of x axis if not
#'   specifying range directly. Defaults to 2\% (\code{0.02}).
#' @param y_axis_buffer Scaler for how much to pad ends of y axis if not
#'   specifying range directly. Defaults to 10\% (\code{0.1}).
#' @param shiny_message_loc A string containing the destination to target for
#'   shiny message passing. Used by \code{shinydrawr}, and can be ignored unless
#'   you're making your own shiny interface.
#' @return Interactive you-draw-it plot.
#'
#' @examples
#' if(interactive()){
#' drawr(
#'   data = dplyr::tibble(x = 1:50, y = sin(x)),
#'   x_col = x, y_col = y,
#'   title = 'My Drawr Chart',
#'   draw_start = 25
#' )
#' }
#' @export
drawr <- function(data,
                  x_col,
                  y_col = NULL,
                  free_draw = FALSE,
                  draw_start = NULL,
                  title = NULL,
                  pin_start = TRUE,
                  x_range = NULL,
                  y_range = NULL,
                  x_lab = NULL,
                  y_lab = NULL,
                  line_style = NULL,
                  drawn_line_color = 'orangered',
                  data_line_color = 'steelblue',
                  x_axis_buffer = 0.02,
                  y_axis_buffer = 0.1,
                  shiny_message_loc = NULL) {
  x_col_quo <- rlang::enquo(x_col)

  if (free_draw) {
    plot_data <- dplyr::select(data, x = !!x_col_quo)
  } else {
    y_col_quo <- rlang::enquo(y_col)
    plot_data <-
      dplyr::select(data, x = !!x_col_quo, y = !!y_col_quo)
  }

  # Grab the limits of data range
  x_min <- min(plot_data$x)
  x_max <- max(plot_data$x)

  if(!free_draw){
    y_min <- min(plot_data$y)
    y_max <- max(plot_data$y)
  }


  if (is.null(x_range)) {
    x_buffer <- (x_max - x_min) * x_axis_buffer
    x_range <- c(x_min - x_buffer, x_max + x_buffer)
  }

  no_y_range <- is.null(y_range)

  if (free_draw & no_y_range) {
    stop("In free draw mode you must supply a y axis range.")
  }

  # If user hasnt requested free draw build the y-range
  if (!free_draw) {

    # If no range supplied, build one from data
    if (no_y_range) {
      y_buffer <- (y_max - y_min) * y_axis_buffer
      y_range <- c(y_min - y_buffer, y_max + y_buffer)
    } else {
      # Otherwise make sure that y range fits and warn if it doesnt
      if (y_range[1] > y_min | y_range[2] < y_max) {
        stop("Supplied y range doesn't cover data fully.")
      }
    }
  }

  if (is.null(x_lab)) {
    x_lab <- rlang::as_name(x_col_quo)
  }
  if (is.null(y_lab)) {
    if (free_draw) {
      y_lab <- 'y'
    } else {
      y_lab <- rlang::as_name(y_col_quo)
    }
  }

  # Make sure start point is in range
  # If user didn't supply any draw start just begin at start of data
  if (is.null(draw_start)) {
    draw_start <- min(plot_data$x)
  } else {
    if ((draw_start <= x_min) | (draw_start >= x_max)) {
      stop('Draw start is out of data range.')
    }
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
      x_name = x_lab,
      y_name = y_lab,
      line_style = line_style,
      data_line_color = data_line_color,
      drawn_line_color = drawn_line_color,
      title = title,
      free_draw = free_draw,
      shiny_message_loc = shiny_message_loc
    )
  )
}
