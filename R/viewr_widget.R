#' Widget form of viewr.
#'
#' This is an internal function for use in the function \code{shinviewr}. It is an htmlwidget that loads a webcam feed to the page. Getting images back from it requires some manipulation that \code{shinyviewr} takes care of.
#'
#' @param outputWidth The number of pixels in width desired from the output frame. Defaults to the size of the container
#' @param outputHeight The number of pixels in height desired from the output frame. Defaults to size of container.
#' @param width How many pixels wide the embeded widget should be (usually left as \code{NULL} to be automatically decided by the function.)
#' @param height How many pixels high the embedded widget should be (again, usually left as \code{NULL}).
#' @param elementID Explicit ID of the widget. Like \code{width} and \code{height} this is usually left as \code{NULL} for R to automatically Assign.
#' @import htmlwidgets
#'
#' @export
viewr_widget <- function(outputWidth = NULL, outputHeight = NULL, width = NULL, height = NULL, elementId = NULL) {

  # forward options using x
  x = list(
    outputWidth = outputWidth,
    outputHeight = outputHeight
  )

  # create widget
  htmlwidgets::createWidget(
    name = 'viewr_widget',
    x,
    width = width,
    height = height,
    package = 'shinysense',
    elementId = elementId
  )
}

#' Shiny bindings for viewr_widget
#'
#' Output and render functions for using viewr_widget within Shiny
#' applications and interactive Rmd documents.
#'
#' @param outputId output variable to read from
#' @param width,height Must be a valid CSS unit (like \code{'100\%'},
#'   \code{'400px'}, \code{'auto'}) or a number, which will be coerced to a
#'   string and have \code{'px'} appended.
#' @param expr An expression that generates a viewr_widget
#' @param env The environment in which to evaluate \code{expr}.
#' @param quoted Is \code{expr} a quoted expression (with \code{quote()})? This
#'   is useful if you want to save an expression in a variable.
#'
#' @name viewr_widget-shiny
#'
#' @export
viewr_widgetOutput <- function(outputId, width = '100%', height = '400px'){
  htmlwidgets::shinyWidgetOutput(outputId, 'viewr_widget', width, height, package = 'shinysense')
}

#' @rdname viewr_widget-shiny
#' @export
renderViewr_widget <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  htmlwidgets::shinyRenderWidget(expr, viewr_widgetOutput, env, quoted = TRUE)
}

#' @keywords internal
viewr_widget_html <- function(id, style, class, ...){
  htmltools::attachDependencies(
    htmltools::tagList(
      htmltools::tags$div(id=id, style=style, class=class, ...)
    ),
    d3r::d3_dep_v4()
  )
}
