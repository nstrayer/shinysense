#' A webcam view and snapshot function. Will send a 3d array back to your computer of the frame when you click take photo.
#' @param id the id you will use to keep track of this component in your app
#' @param ... additional tags to \code{\link{div}} to display before plot is
#' displayed
#' @return A video overlay and a 'shutter' button.
#' @export
#' @examples
#' \dontrun{
#' shinyviewrUI('myrecorder')
#' }
#' @import shiny
shinyviewrUI <- function(id){
  # Create a namespace function using the provided id
  ns <- NS(id)

  #set up output
  viewr_widgetOutput(ns('myCamera'))
}


#' Gather recorded data from UI.
#'
#' Upon completion of line draw, returns a reactive variable that contains a vector of the y coordinates of what the user has drawn. This also includes the start point specified with `draw_start`
#'     This is the server component of shinyviewr. You never directly use this function but instead call it through the shiny function `callModule()`. See the example for how to do this.
#'
#' @param input you can ignore this as it is taken care of by shiny
#' @param output you can ignore this as it is taken care of by shiny
#' @param session you can ignore this as it is taken care of by shiny
#' @export
#' @examples
#' \dontrun{
#'  drawChart <- shiny::callModule(shinyviewr, "myCamera")
#'  }
#' @importFrom jsonlite toJSON
shinyviewr <- function(input, output, session){

  output$myCamera <- renderViewr_widget(
    viewr_widget(message= 'take me out')
  )

  result <- reactive({ input$myCamera_photo })
  return(result)
}
