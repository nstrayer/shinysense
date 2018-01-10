#' Use shiny on your mobile phone to gather accelorameter data for whatever your heart could desire.
#' @param id the id you will use to keep track of this component in your app
#' @return A blue button that you press to initiate or stop recording of acceloration data.
#' @export
#' @examples
#' shinymovrUI('movrButton')
shinymovrUI <- function(id) {
  ns <- NS(id)

  #Grab the external javascript and css
  gyronorm <- .get_script("libraries/gyronorm.js", "js")
  movrjs  <- .get_script("movr.js", "js")

  tagList(
    singleton(
      tags$head( #load external scripts.
        tags$script(HTML(gyronorm)),
        tags$script(HTML(movrjs))
      )
    ),
    tags$button(id = ns("movr"),
        "Turn On"
    )

  ) #end tag list.
}


#' Gather recorded data from UI.
#'
#' Contains a reactive variable that will update as new data comes in.
#'
#' @param input you can ignore this as it is taken care of by shiny
#' @param output you can ignore this as it is taken care of by shiny
#' @param session you can ignore this as it is taken care of by shiny
#' @param movements list of desired movement directions from sensor
#' @param orientations list of desired orientation directions from sensor (good when not used on phone)
#' @param time_limit number of seconds for data gathering, defaults to until button pressed again.
#' @param recording_message text for the button when recording is taking place.
#' @export
#' @examples
#'  movrData <- callModule(shinymovr)
shinymovr <- function(
  input, output, session,
  movements = c('x', 'y', 'z', 'gamma', 'beta', 'alpha'),
  orientations = c('alpha', 'beta', 'gamma'),
  time_limit = -1,
  recording_message = 'Recording Movement...'
){

  #Send over a message to the javascript with the id of the div we're placing this chart in along with the data we're placing in it.
  observe({ session$sendCustomMessage(
            type    = "initialize_movr",
            message = list(
              destination = session$ns(""),
              id = session$ns("movr"),
              movement_directions = movements,
              orientation_directions = orientations,
              time_lim = time_limit,
              recording_message = recording_message
            )
          )
      })

  # The user's drawn data, parsed into a data frame
  result <- reactive({
    if(class(input$movement) == "character"){
      movement_data <- jsonlite::fromJSON(input$movement)
      return(jsonlite::fromJSON(input$movement))
    } else {
        return(data.frame(time = 0, x = 0, y = 0, z = 0))
    }
    })
  return(result)
}
