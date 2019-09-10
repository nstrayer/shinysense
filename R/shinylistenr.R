#' Make a record button for UI.
#'
#' @param id the id you will use to keep track of this component in your app
#' @return A blue button that you press to initiate or stop recording of sound.
#' @export
#' @examples
#' shinylistenr_UI('myrecorder')
shinylistenr_UI <- function(id) {
  ns <- NS(id)

    r2d3::d3Output(ns("shinylistenr"), height = 'auto')
  # tagList(
  # ) #end tag list.
}


#' Gather recorded data from UI.
#'
#' Exports a reactive array of length 256, corresponding to a fourier transform of the sound waves of your recoding. This is a frequently used format for running various speech recognition algorithms on. Future edditions will allow access to the raw data.
#'     This is the server component of shinylistenr. You never directly use this function but instead call it through the shiny function `callModule()`. See the example for how to do this.
#'
#' @param input you can ignore this as it is taken care of by shiny
#' @param output you can ignore this as it is taken care of by shiny
#' @param session you can ignore this as it is taken care of by shiny
#' @param button_text Text displayed on button before or after recording. Defaults to `"Record Audio"`.
#' @param while_recording_text Text displayed on button while recording is in progress. Defaults to `"Stop Recording"`.
#' @export
#' @examples
#' \dontrun{
#' shiny::callModule(shinylistenr, "myrecorder")
#' }
shinylistenr <- function(
  input, output, session,
  button_text = 'Record Audio',
  while_recording_text = 'Stop Recording'
){


  output$shinylistenr <- r2d3::renderD3({
    r2d3::r2d3(
      system.file("r2d3/listenr/main.js", package = "shinysense"),
      data = list(
        button_text = button_text,
        while_recording_text = while_recording_text,
        shiny_message_loc = session$ns('listenr_data')
      ),
      container = 'div',
      dependencies = 'd3-jetpack',
      css = system.file("r2d3/listenr/styles.css", package = "shinysense")
    )
  })


  # The user's data, parsed into a data frame
  result <- reactive({ input$listenr_data })

  return(result)
}
