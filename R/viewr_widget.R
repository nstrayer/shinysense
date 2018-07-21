#' <Add Title>
#'
#' <Add Description>
#'
#' @import htmlwidgets
#'
#' @export
viewr_widget <- function(message, width = NULL, height = NULL, elementId = NULL) {

  # forward options using x
  x = list(
    message = message
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
