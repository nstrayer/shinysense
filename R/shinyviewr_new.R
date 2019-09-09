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
shinyviewr_new_UI <- function(id, width = '100%', height = '400px'){
  # Create a namespace function using the provided id
  ns <- NS(id)

  #set up output
  r2d3::d3Output(ns("shinyviewr"), height = height)
}


#' Gather recorded data from UI.
#'
#' Upon completion of line draw, returns a reactive variable that contains a vector of the y coordinates of what the user has drawn. This also includes the start point specified with `draw_start`
#'     This is the server component of shinyviewr. You never directly use this function but instead call it through the shiny function `callModule()`. See the example for how to do this.
#'
#' @param input you can ignore this as it is taken care of by shiny
#' @param output you can ignore this as it is taken care of by shiny
#' @param session you can ignore this as it is taken care of by shiny
#' @param output_width,output_height How many pixels wide or tall you want your returned photos/the view of the webcam.
#'   When left unfilled or set to \code{NULL} this will attempt to fill whatever size your UI element is. For many image
#'   related tasks you want the output to be a square. So setting this to something like 300x300 is a good idea.
#' @return A reactive function that will return a 3D array with dimensions \code{(height, width, channels (RGBA))} corresponding to the
#'   image taken by the webcam when shutter was pressed. The RGBA are all in the range of 0-1.
#' @export
#' @examples
#' \dontrun{
#'  drawChart <- shiny::callModule(shinyviewr, "myCamera")
#'  }
#' @importFrom jsonlite toJSON
shinyviewr_new <- function(
  input, output, session,
  output_width = 300,
  output_height = 300
){

  output$shinyviewr <- r2d3::renderD3({
    r2d3::r2d3(
      system.file("r2d3/viewr/main.js", package = "shinysense"),
      data = NULL,
      container = 'div',
      dependencies = 'd3-jetpack',
      options = list(
        shiny_message_loc = session$ns('viewr_message'),
        output_size = list(
          width = output_width,
          height = output_height
        )
      )
    )
  })

  shiny::reactive({
    shiny::req(input$viewr_message)

    input$viewr_message %>%
      str_remove('data:image/png;base64,') %>%
      str_replace(' ', '+') %>%
      base64enc::base64decode() %>%
      png::readPNG() %>%
      .[,,-4] %>%
      as.raster()
  })
}
