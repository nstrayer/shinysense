#' Add a swipeable card to shiny app: UI function
#'
#' Wraps whatever UI elements are passed to it in a card format that can then be
#' swiped to the left, right, up, or down with the results of that action being
#' sent to the shiny app.
#'
#' @seealso \code{\link{shinyswipr}}
#' @param id The id of the current element you are entering
#' @param ... Any other UI elements you wish to include within the swiping zone.
#' @examples
#' \dontrun{
#' shinyswipr_UI(id = "myswipr", h1("This is my title"), p("here is some text"))
#' }
#' @export
shinyswipr_UI <- function(id, ...) {
  ns <- shiny::NS(id)

  #check if the user passed anything else for the card.
  if (length(list(...)) == 0)
    stop("You need to pass something to the card.")

  #grab our javascript and css files
  touch_swipe_file <- .get_script("touchSwipe.js", "js")
  shiny_swipe_file <- .get_script("shinySwiper.js", "js")
  swipe_style_file <- .get_script("swiprStyle.css", "css")

  shiny::tagList(shiny::singleton(
    shiny::tags$head(
      #load our javascript files for this.
      shiny::tags$script(shiny::HTML(touch_swipe_file)),
      shiny::tags$script(shiny::HTML(shiny_swipe_file)),
      shiny::tags$style(shiny::HTML(swipe_style_file))
    )
  ),
  shiny::div(id = id, class = "swiperCard", ...)) #end tag list.
}


#' Add a swipeable card to shiny app: server function
#'
#' This is the server component of the shiny swipr app. You never directly use
#' this function but instead call it through the shiny function `callModule()`.
#' See the example for how to do this.
#'
#' @seealso \code{\link{shinyswipr_UI}}
#' @inheritParams shinyviewr
#'
#' @examples
#' \dontrun{
#' callModule(shinyswipr, "myswipr")
#' }
#' @export
shinyswipr <- function(input, output, session) {
  #the id of our particular card. We send this to javascript.
  card_id <- gsub("-", "", session$ns(""))

  #Send over a message to the javascript to initialize the card.
  shiny::observe({
    session$sendCustomMessage(type = "initializeCard", message = card_id)
  })

  #gather the swipe result.
  swipe_result <- shiny::reactive({
    #strip away the count so the user just gets a nice direction back.
    if (is.null(input$cardSwiped)) {
      input$cardSwiped
    } else {
      strsplit(input$cardSwiped, "-")[[1]][2]
    }
  })

  return(swipe_result)
}
