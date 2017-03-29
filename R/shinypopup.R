#' Make a popup button that users have to accept before seeing content.
#'
#' @param id the id you will use to keep track of this component in your app
#' @param buttonText text that appears in the button for accepting the terms of the popup
#' @param popupDiv standard html content for the popup card. E.g. `div("my terms are")`
#' @return A popup that blurs everything behind it and dissapears upon a button click.
#' @export
#' @examples
#' shinypopupUI('myTerms')
shinypopupUI <- function(id, buttonText, popupDiv, ...) {
  ns <- NS(id)

  #check if the user passed anything else for the card.
  if (length(list(...)) == 0) stop("You need to pass something to the card.")

  #grab our javascript and css files
  popup_file <- .get_script("popup.js", "js")
  print("loaded popupjs")

  tagList(
    singleton(
      tags$head( #load our javascript files for this.
        tags$script(HTML(popup_file))
      )
    ),
    ...,
    div(id = "background_cover"),
    div(id = id, class = "popup",
        popupDiv,
        actionButton(ns("acceptButton"),buttonText ) #button that the server watches to kill popup.
    )  #popup div goes over.

  ) #end tag list.
}

#' Listens for clicking of accept button and kills popup if clicked.
#'
#' Just sits there, no need to pass it anything.
#'
#' @param input you can ignore this as it is taken care of by shiny
#' @param output you can ignore this as it is taken care of by shiny
#' @param session you can ignore this as it is taken care of by shiny
#' @export
#' @examples
#' callModule(shinypopup, "myTerms")
shinypopup <- function(input, output, session) {

  #the id of our particular card. We send this to javascript.
  card_id <- gsub("-", "", session$ns(""))

  #Send over a message to the javascript to initialize the card.
  # observe({ session$sendCustomMessage(type = "initializePopup", message = card_id) })
  observeEvent(input$acceptButton,{
    # print("button clicked")
    session$sendCustomMessage(type = "killPopup", message = "killPopup")
  })
}
