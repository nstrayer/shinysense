#' Make a you draw it line chart in the style of this [New York Times article](https://www.nytimes.com/interactive/2017/01/15/us/politics/you-draw-obama-legacy.html?mtrref=undefined&gwh=D06000A9C788821324D9EED3BCA9C3D1&gwt=pay) about  button for UI.
#'
#' @param id the id you will use to keep track of this component in your app
#' @return A blue button that you press to initiate or stop recording of sound.
#' @export
#' @examples
#' shinydrawrUI('myrecorder')
shinydrawrUI <- function(id) {
  ns <- NS(id)

  #Grab the external javascript and css
  youDrawItjs <- .get_script("libraries/youDrawIt.js", "js")
  drawrjs     <- .get_script("drawr.js", "js")
  # drawrcss <- .get_script("drawr.css", "css")

  tagList(
    singleton(
      tags$head( #load external scripts.
        tags$script(HTML(youDrawItjs)),
        tags$script(HTML(drawrjs))
      )
    ),
    div(id = ns("youDrawIt"),
        h1("hi")
    )

  ) #end tag list.
}


#' Gather recorded data from UI.
#'
#' Exports a reactive array of length 256, corresponding to a fourier transform of the sound waves of your recoding. This is a frequently used format for running various speech recognition algorithms on. Future edditions will allow access to the raw data.
#'     This is the server component of shinydrawr. You never directly use this function but instead call it through the shiny function `callModule()`. See the example for how to do this.
#'
#' @param input you can ignore this as it is taken care of by shiny
#' @param output you can ignore this as it is taken care of by shiny
#' @param session you can ignore this as it is taken care of by shiny
#' @param data dataframe containing data you want to plot in two of its columns
#' @param draw_start position on the x-axis the true data is blocked off and the user is to draw from.
#' @param x_key name of the x column.
#' @param y_key name of the y column.
#' @param y_min value of the lowest possible value the user is allowed to draw, defaults to lowest seen in data.
#' @param y_max value of the highest possible value the user is allowed to draw, defaults to highest seen in data.
#' @export
#' @examples
#' callModule(shinydrawr, "myrecorder")
shinydrawr <- function(input, output, session,
                       data,
                       draw_start,
                       x_key = "x",
                       y_key = "y",
                       y_min = NA,
                       y_max = NA){

  #set chart maximum y of the data's max y if nothing has been specified.
  if(is.na(y_min)) y_min <- min(data[y_key])
  if(is.na(y_max)) y_max <- max(data[y_key])

  data_jsonified <- jsonlite::toJSON(data)

  #the id of our given recorder button. We send this to javascript.
  chart_id <- gsub("-", "", session$ns(""))


  # #Send over a message to the javascript with the id of the div we're placing this chart in along with the data we're placing in it.
  observe({ session$sendCustomMessage(
            type    = "initialize_chart",
            message = list(
                           data          = data_jsonified,
                           dom_target    = chart_id,
                           reveal_extent = draw_start,
                           x_key         = x_key,
                           y_key         = y_key,
                           y_domain      = c(y_min,y_max)
                         )
            )
      })
  #
  # # The user's data, parsed into a data frame
  # result <- reactive({ input$recordingEnded })
  #
  # return(result)
}
