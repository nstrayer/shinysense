#' A webcam view and snapshot function. Will send a 3d array (width, height, colors+opacity) back to your computer of the frame when you click take photo.
#' @param id the id you will use to keep track of this component in your app
#' @param width,height Must be a valid CSS unit (like \code{'100\%'},
#'   \code{'400px'}, \code{'auto'}) or a number, which will be coerced to a
#'   string and have \code{'px'} appended. (Taken from htmlwidgets docs).
#' @return A video overlay and a 'shutter' button.
#' @export
#' @examples
#' \dontrun{
#' shinyviewrUI('myrecorder')
#' }
#' @import shiny
shinyviewrUI <- function(id, width = '100%', height = '400px'){
  # Create a namespace function using the provided id
  ns <- NS(id)

  #set up output
  viewr_widgetOutput(ns('myCamera'), width = width, height = height)
}


#' Gather recorded data from UI.
#'
#' Upon completion of line draw, returns a reactive variable that contains a vector of the y coordinates of what the user has drawn. This also includes the start point specified with `draw_start`
#'     This is the server component of shinyviewr. You never directly use this function but instead call it through the shiny function `callModule()`. See the example for how to do this.
#'
#' @param input you can ignore this as it is taken care of by shiny
#' @param output you can ignore this as it is taken care of by shiny
#' @param session you can ignore this as it is taken care of by shiny
#' @param outputWidth How many pixels wide you want your returned photos. Defaults to 200px
#' @param outputHeight How many pixels hight you want your returned photos. Defaults to 150px
#' @export
#' @examples
#' \dontrun{
#'  drawChart <- shiny::callModule(shinyviewr, "myCamera")
#'  }
#' @importFrom jsonlite toJSON
shinyviewr <- function(input, output, session, outputWidth = 200, outputHeight = 150){

  output$myCamera <- renderViewr_widget(
    viewr_widget(outputWidth = outputWidth, outputHeight = outputHeight)
  )

  result <- reactive({
    if(is.null(input$myCamera_photo)){
      return(NULL)
    }
    input$myCamera_photo %>%
      str_remove('data:image/png;base64,') %>%
      str_replace(' ', '+') %>%
      base64enc::base64decode() %>%
      png::readPNG()
  })
  return(result)
}
