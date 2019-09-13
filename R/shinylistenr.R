#' Access data from user's microphone: UI version
#'
#' @seealso \code{\link{shinylistenr}}
#' @param id the id you will use to keep track of this component in your app
#' @return A blue button that you press to initiate or stop recording of sound.
#' @examples
#' \dontrun{
#' shinylistenr_UI("recorder")
#' }
#' @export
shinylistenr_UI <- function(id) {
  ns <- NS(id)
  r2d3::d3Output(ns("shinylistenr"), height = 'auto')
}


#' Access data from user's microphone: server version
#'
#' Exports a reactive array of length 256, corresponding to a fourier transform
#' of the sound waves of your recording. This is a frequently used format for
#' running various speech recognition algorithms on. Future editions will allow
#' access to the raw data. You
#' never directly use this function but instead call it through the shiny
#' function `callModule()`. See the example for how to do this.
#'
#' @seealso \code{\link{shinylistenr_UI}}
#' @inheritParams shinyviewr
#' @param button_text Text displayed on button before or after recording.
#'   Defaults to `"Record Audio"`.
#' @param while_recording_text Text displayed on button while recording is in
#'   progress. Defaults to `"Stop Recording"`.
#' @export
#' @examples
#' \dontrun{
#' callModule(shinylistenr, "myrecorder")
#' }
shinylistenr <- function(input,
                         output,
                         session,
                         button_text = 'Record Audio',
                         while_recording_text = 'Stop Recording') {
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
  result <- reactive({
    input$listenr_data
  })

  return(result)
}
