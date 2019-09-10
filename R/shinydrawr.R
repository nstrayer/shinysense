#' Make a you draw it line chart in the style of this [New York Times article](https://www.nytimes.com/interactive/2017/01/15/us/politics/you-draw-obama-legacy.html?mtrref=undefined&gwh=D06000A9C788821324D9EED3BCA9C3D1&gwt=pay) about  button for UI.
#'    Wherever this is placed in the UI it will make a line chart that can be drawn on.
#' @param id the id you will use to keep track of this component in your app
#' @param height How tall the plot should be in css valid units. Defaults to `'400px'`.
#' @return UI portion of the shinydrawr module
#' @export
#' @examples
#' \dontrun{
#' shinydrawr_UI("drawr_widget", height = '300px')
#' }
shinydrawr_UI <- function(id, height = '400px'){
  # Create a namespace function using the provided id
  ns <- shiny::NS(id)

  #set up output
  shiny::tagList(
    r2d3::d3Output(ns("shinydrawr"), height = height)
  )

}


#' Gather recorded data from UI.
#'
#' Upon completion of line draw, returns a reactive variable that contains a vector of the y coordinates of what the user has drawn. This also includes the start point specified with `draw_start`
#'     This is the server component of shinydrawr. You never directly use this function but instead call it through the shiny function `callModule()`. See the example for how to do this.
#'
#' @param input,output,session you can ignore this as it is taken care of by shiny
#' @param data dataframe containing data you want to plot in two of its columns
#' @param x_col Name of column for x axis
#' @param y_col Name of column for y axis. Can be left empty if `free_draw = TRUE`.
#' @param free_draw Do you just want the user to draw data on a supplied x-range? I.e. no revealed line?
#' @param draw_start If doing a revealed line, where on the x axis to start obscuring data for drawing?
#' @param title Text for title, if desired.
#' @param pin_start Pin start of drawn line to end of shown data? Defaults to `TRUE`.
#' @param x_range Two element array of min and max of x range. Otherwise defaults to min and max of data.
#' @param y_range Two element array of min and max of y range. Otherwise defaults to min and max of data.
#' @param x_lab Text to label x axis, defaults to name of column used for x-axis
#' @param y_lab Text to label y axis, defaults to name of column, or in free-draw case, to just `'y'`.
#' @param line_style List containing any styling that is desired for the default line. For options see [MDN SVG line](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/line). Make sure to camelCase all attributes.
#' @param drawn_line_color CSS valid color for user-drawn line. Defaults to `"orangered"`.
#' @param data_line_color CSS valid color for data line. Defaults to `"steelblue"`.
#' @param x_axis_buffer Scaler for how much to pad ends of x axis if not specifying range directly. Defaults to 2% (`0.02`).
#' @param y_axis_buffer Scaler for how much to pad ends of y axis if not specifying range directly. Defaults to 10% (`0.1`).
#' @param shiny_message_loc A string containing the destination to target for shiny message passing. Used by `shinydrawr`, and can be ignored unless you're making your own shiny interface.
#' @export
#' @examples
#' \dontrun{
#' callModule(
#'   shinydrawr,
#'   'drawr_widget',
#'   data,
#'   x_col = time,
#'   y_col = metric,
#'   draw_start = 20
#' )
#' }
shinydrawr <- function(
  input, output, session,
  data,
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
  y_axis_buffer = 0.1
) {
  message_loc <- session$ns('drawr_message')

  drawn_data <- shiny::reactiveVal()

  if(free_draw){
    y_col <- NULL
  } else {
    y_col <- rlang::enquo(y_col)
  }

  output$shinydrawr <- r2d3::renderD3({

    shinysense::drawr(
      data = data,
      x_col = !!rlang::enquo(x_col),
      y_col = !!y_col,
      free_draw = free_draw,
      draw_start = draw_start,
      shiny_message_loc = message_loc,
      title = title,
      pin_start = pin_start,
      x_range = x_range,
      y_range = y_range,
      x_lab = x_lab,
      y_lab = y_lab,
      line_style = line_style,
      drawn_line_color = drawn_line_color,
      data_line_color = data_line_color,
      x_axis_buffer = x_axis_buffer,
      y_axis_buffer = y_axis_buffer
    )
  })

  shiny::observeEvent(input$drawr_message, {
    drawn_ys <- input$drawr_message

    if(free_draw){
      data_to_return <- data
    } else {
      data_to_return <- dplyr::filter(data, !!rlang::enquo(x_col) >= draw_start)
    }
    drawn_data(
      dplyr::mutate(data_to_return, drawn = input$drawr_message)
    )

  })

  return(drawn_data)
}
