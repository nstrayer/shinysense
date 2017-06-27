#' Make a record button for UI.
#'
#' @param id the id you will use to keep track of this component in your app
#' @return A blue button that you press to initiate or stop recording of sound.
#' @export
#' @examples
#' shinyearrUI('myrecorder')
shinyearrUI <- function(id) {
  ns <- NS(id)

  #Grab the external javascript and css
  earjs  <- .get_script("earr.js", "js")
  earcss <- .get_script("earr.css", "css")

  tagList(
    singleton(
      tags$head( #load external scripts.
        tags$script(HTML(earjs)),
        tags$style(HTML(earcss))
      )
    ),
    div(id=ns("recordButton"), class = "recordButton", span("Start Recording"))
  ) #end tag list.
}


#' Gather recorded data from UI.
#'
#' Exports a reactive array of length 256, corresponding to a fourier transform of the sound waves of your recoding. This is a frequently used format for running various speech recognition algorithms on. Future edditions will allow access to the raw data.
#'     This is the server component of shinyearr. You never directly use this function but instead call it through the shiny function `callModule()`. See the example for how to do this.
#'
#' @param input you can ignore this as it is taken care of by shiny
#' @param output you can ignore this as it is taken care of by shiny
#' @param session you can ignore this as it is taken care of by shiny
#' @export
#' @examples
#' \dontrun{
#' shiny::callModule(shinyearr, "myrecorder")
#' }
shinyearr <- function(input, output, session){

  #the id of our given recorder button. We send this to javascript.
  button_id <- gsub("-", "", session$ns(""))

  #Send over a message to the javascript to initialize the recoder code
  observe({ session$sendCustomMessage(type = "initialize_recorder", message = button_id) })

  # The user's data, parsed into a data frame
  result <- reactive({ input$recordingEnded })

  return(result)
}
