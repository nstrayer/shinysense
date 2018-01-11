#' Use shiny on your mobile phone to gather accelorameter data for whatever your heart could desire.
#' @param id the id you will use to keep track of this component in your app
#' @param resting_msg the string displayed when the button is not pressed. Defaults to "Turn On"
#' @param button_width width of the button in a valid css string. E.g. needs to have pixels appended to it.
#' @param button_height height of the button, again in valid css string.
#' @param button_color valid css string to control the button color.
#' @return A blue button that you press to initiate or stop recording of acceloration data.
#' @export
#' @examples
#' shinymovrUI('movrButton', resting_msg = 'Click me to record', button_width = '200px')
shinymovrUI <- function(id,
                        resting_msg = 'Turn On',
                        button_width = '130px',
                        button_height = '50px',
                        button_color = 'steelblue'
                        ) {
  ns <- NS(id)

  # convert the css

  # Grab the external javascript and css
  gyronorm <- .get_script("libraries/gyronorm.js", "js")
  movrjs <- .get_script("movr.js", "js")
  movr_css <- .get_script("movr.css", "css")


  tagList(
    singleton(
      tags$head( # load external scripts.
        tags$script(HTML(gyronorm)),
        tags$script(HTML(movrjs)),
        tags$style(HTML(movr_css))
      )
    ),
    tags$button(
      id = ns("movr"),
      class = 'movr-button',
      style = sprintf(
        "background-color: %s; width: %s; height:%s",
        button_color, button_width, button_height
      ),
      resting_msg
    )
  ) # end tag list.
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
#' @param normalized Do you want the data for each output normalized by this samples mean and standard deviation? Defaults to true.
#' @export
#' @examples
#'  movrData <- callModule(shinymovr)
shinymovr <- function(
                      input, output, session,
                      movements = c("x", "y", "z", "gamma", "beta", "alpha"),
                      orientations = c("alpha", "beta", "gamma"),
                      time_limit = -1,
                      recording_message = "Recording Movement...",
                      normalized = TRUE) {

  # Send over a message to the javascript with the id of the div we're placing this chart in along with the data we're placing in it.
  observe({
    session$sendCustomMessage(
      type = "initialize_movr",
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
    if (class(input$movement) == "character") {
      movement_data <- jsonlite::fromJSON(input$movement)

      if (normalized) {
        movement_data[-1] <- scale(movement_data[-1])
      }
      return(movement_data)
    } else {
      # when initializing just return an empty dataframe with the correct columns
      result_columns <- c(
        "time",
        paste0("m_", movements),
        paste0("o_", orientations)
      )
      return(setNames(data.frame(matrix(ncol = length(result_columns), nrow = 0)), result_columns))
    }
  })
  return(result)
}
