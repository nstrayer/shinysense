#' shinyswipr UI function
#'
#' This is the UI component of the shiny swipr app
#'
#' @param id The id of the current element you are entering
#' @param ... Any other UI elements you wish to include within the swiping zone.
#' @export
#' @examples
#' \dontrun{
#' shinyswiprUI(id = "myswipr", h1("This is my title"), p("here is some text"))
#' }
shinyswiprUI <- function(id, ...) {
  ns <- NS(id)

  #check if the user passed anything else for the card.
  if (length(list(...)) == 0) stop("You need to pass something to the card.")

  #grab our javascript and css files
  touch_swipe_file <- .get_script("touchSwipe.js", "js")
  shiny_swipe_file <- .get_script("shinySwiper.js", "js")
  swipe_style_file <- .get_script("swiprStyle.css", "css")

  tagList(
    singleton(
      tags$head( #load our javascript files for this.
        tags$script(HTML(touch_swipe_file)),
        tags$script(HTML(shiny_swipe_file)),
        tags$style(HTML(swipe_style_file))
      )
    ),
    div(id = id, class = "swiperCard", ...)
  ) #end tag list.
}


#' shinyswipr server function
#'
#' This is the server component of the shiny swipr app. You never directly use this function but instead call it through the shiny function `callModule()`. See the example for how to do this.
#'
#' @param input you can ignore this as it is taken care of by shiny
#' @param output you can ignore this as it is taken care of by shiny
#' @param session you can ignore this as it is taken care of by shiny
#' @export
#' @examples
#' \dontrun{
#' callModule(shinyswipr, "myswipr")
#' }
shinyswipr <- function(input, output, session) {

  #the id of our particular card. We send this to javascript.
  card_id <- gsub("-", "", session$ns(""))

  #Send over a message to the javascript to initialize the card.
  observe({ session$sendCustomMessage(type = "initializeCard", message = card_id) })

  #gather the swipe result.
  swipe_result <- reactive({

    #strip away the count so the user just gets a nice direction back.
    if(is.null(input$cardSwiped)){
      input$cardSwiped
    } else {
      strsplit(input$cardSwiped, "-")[[1]][2]
    }
  })

  return(swipe_result)
}
