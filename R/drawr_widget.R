#' Creates and embeds a nice you draw it chart
#'
#' Makes a draw chart that can go into an rmarkdown or a shiny app.
#'
#' @param data dataframe containing data you want to plot in two of its columns
#' @param draw_start position on the x-axis the true data is blocked off and the user is to draw from.
#' @param raw_draw set to true if you want to not draw any line, just let the user draw everything. Auto sets draw_start to begining of data.
#' @param x_key name of the x column.
#' @param y_key name of the y column.
#' @param y_min value of the lowest possible value the user is allowed to draw, defaults to lowest seen in data.
#' @param y_max value of the highest possible value the user is allowed to draw, defaults to highest seen in data.
#' @import htmlwidgets
#'
#' @export
drawr_widget <- function(
  data,
  draw_start,
  raw_draw = FALSE,
  x_key = "x",
  y_key = "y",
  y_min = NA,
  y_max = NA,
  width = NULL, height = NULL, elementId = NULL) {

  # Check if we have time data.
  hasTimeX = inherits(data[[x_key]], "Date")

  # If we do have time data, convert it to a format the js viz likes.
  if (hasTimeX) {
    newXCol = format(data[[x_key]], format="%m-%d-%Y")
  }

  # Check to make sure the draw start and the x column are the same type.

  # forward options using x
  x = list(
    data = data,
    xKey = x_key,
    yKey = y_key,
    yMin = y_min,
    yMax = y_max,
    timeX = hasTimeX,
    revealExtent = draw_start,
    freeDraw = raw_draw
  )

  # create widget
  htmlwidgets::createWidget(
    name = 'drawr_widget',
    x,
    width = width,
    height = height,
    package = 'shinysense',
    elementId = elementId
  )
}

#' Shiny bindings for drawr_widget
#'
#' Output and render functions for using drawr_widget within Shiny
#' applications and interactive Rmd documents.
#'
#' @param outputId output variable to read from
#' @param width,height Must be a valid CSS unit (like \code{'100\%'},
#'   \code{'400px'}, \code{'auto'}) or a number, which will be coerced to a
#'   string and have \code{'px'} appended.
#' @param expr An expression that generates a drawr_widget
#' @param env The environment in which to evaluate \code{expr}.
#' @param quoted Is \code{expr} a quoted expression (with \code{quote()})? This
#'   is useful if you want to save an expression in a variable.
#'
#' @name drawr_widget-shiny
#'
#' @export
drawr_widgetOutput <- function(outputId, width = '100%', height = '400px'){
  htmlwidgets::shinyWidgetOutput(outputId, 'drawr_widget', width, height, package = 'shinysense')
}

#' @rdname drawr_widget-shiny
#' @export
renderDrawr_widget <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  # # The user's drawn data, parsed into a data frame
  # result <- reactive({ input$doneDragging })

  htmlwidgets::shinyRenderWidget(expr, drawr_widgetOutput, env, quoted = TRUE)
}
