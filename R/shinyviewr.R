#' <Add Title>
#'
#' <Add Description>
#'
#' @import htmlwidgets
#'
#' @export
shinyviewr <- function(message, width = NULL, height = NULL, elementId = NULL) {

  # forward options using x
  x = list(
    message = message
  )

  # create widget
  htmlwidgets::createWidget(
    name = 'shinyviewr',
    x,
    width = width,
    height = height,
    package = 'shinysense',
    elementId = elementId
  )
}

#' Shiny bindings for shinyviewr
#'
#' Output and render functions for using shinyviewr within Shiny
#' applications and interactive Rmd documents.
#'
#' @param outputId output variable to read from
#' @param width,height Must be a valid CSS unit (like \code{'100\%'},
#'   \code{'400px'}, \code{'auto'}) or a number, which will be coerced to a
#'   string and have \code{'px'} appended.
#' @param expr An expression that generates a shinyviewr
#' @param env The environment in which to evaluate \code{expr}.
#' @param quoted Is \code{expr} a quoted expression (with \code{quote()})? This
#'   is useful if you want to save an expression in a variable.
#'
#' @name shinyviewr-shiny
#'
#' @export
shinyviewrOutput <- function(outputId, width = '100%', height = '400px'){
  htmlwidgets::shinyWidgetOutput(outputId, 'shinyviewr', width, height, package = 'shinysense')
}

#' @rdname shinyviewr-shiny
#' @export
renderShinyviewr <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  htmlwidgets::shinyRenderWidget(expr, shinyviewrOutput, env, quoted = TRUE)
}

#' @keywords internal
shinyviewr_html <- function(id, style, class, ...){
  htmltools::attachDependencies(
    htmltools::tagList(
      htmltools::tags$div(id=id, style=style, class=class, ...)
    ),
    d3r::d3_dep_v4()
  )
}
