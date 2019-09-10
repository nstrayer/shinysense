#' Make a you draw it line chart in the style of this [New York Times article](https://www.nytimes.com/interactive/2017/01/15/us/politics/you-draw-obama-legacy.html?mtrref=undefined&gwh=D06000A9C788821324D9EED3BCA9C3D1&gwt=pay) about  button for UI.
#'    Wherever this is placed in the UI it will make a line chart that can be drawn on.
#' @param id the id you will use to keep track of this component in your app
#' @param ... additional tags to \code{\link{div}} to display before plot is
#' displayed
#' @return A blue button that you press to initiate or stop recording of sound.
#' @export
#' @examples
#' shinydrawrUI('myrecorder')
#' @import shiny
shinydrawrUI <- function(id){
  # Create a namespace function using the provided id
  ns <- NS(id)

  #set up output
  drawr_widgetOutput(ns('myDrawr'))
}


#' Gather recorded data from UI.
#'
#' Upon completion of line draw, returns a reactive variable that contains a vector of the y coordinates of what the user has drawn. This also includes the start point specified with `draw_start`
#'     This is the server component of shinydrawr. You never directly use this function but instead call it through the shiny function `callModule()`. See the example for how to do this.
#'
#' @param input you can ignore this as it is taken care of by shiny
#' @param output you can ignore this as it is taken care of by shiny
#' @param session you can ignore this as it is taken care of by shiny
#' @param data dataframe containing data you want to plot in two of its columns
#' @param draw_start position on the x-axis the true data is blocked off and the user is to draw from.
#' @param raw_draw set to true if you want to not draw any line, just let the user draw everything. Auto sets draw_start to begining of data.
#' @param x_key name of the x column.
#' @param y_key name of the y column.
#' @param y_min value of the lowest possible value the user is allowed to draw, defaults to lowest seen in data.
#' @param y_max value of the highest possible value the user is allowed to draw, defaults to highest seen in data.
#' @export
#' @examples
#' \dontrun{
#'  drawChart <- shiny::callModule(shinydrawr,
#'     "outbreak_stats",
#'     random_data,
#'     draw_start = 15,
#'     x_key = "time",
#'     y_key = "metric")
#'  }
#' @importFrom jsonlite toJSON
shinydrawr <- function(input, output, session,
                       data,
                       draw_start,
                       raw_draw = FALSE,
                       x_key = "x",
                       y_key = "y",
                       y_min = NA,
                       y_max = NA) {

  output$myDrawr <- renderDrawr_widget(
    drawr_widget(data = data, draw_start = draw_start, x_key = x_key, y_key = y_key, y_min = y_min, y_max = y_max)
  )

  result <- reactive({ input$myDrawr_drawnData })
  return(result)
}
