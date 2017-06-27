#' Make a popup button that users have to accept before seeing content.
#'
#' @param id the id you will use to keep track of this component in your app
#' @param buttonText text that appears in the button for accepting the terms of the popup
#' @param popupDiv standard html content for the popup card. E.g. `div("my terms are")`
#' @param ... additional argument to pass to \code{\link{tagList}}
#' @return A popup that blurs everything behind it and dissapears upon a button click.
#' @export
#' @examples
#' \dontrun{
#' shinypopupUI('myTerms')
#' }
shinypopupUI <- function(id, buttonText, popupDiv, ...) {
  ns <- NS(id)

  #check if the user passed anything else for the card.
  if (length(list(...)) == 0) stop("You need to pass something to the card.")

  #grab our javascript and css files
  popup_js  <- .get_script("popup.js", "js")
  popup_css <- .get_script("popup.css", "css")

  tagList(
    singleton(
      tags$head( #load our javascript files for this.
        tags$script(HTML(popup_js)),
        tags$style(HTML(popup_css))
      )
    ),
    ...,
    div(id = "background_cover",class = "hidden"),
    div(id = id, class = "popup hidden",
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
#' @param accepted Logical variable indicating if the user has accepted the terms already. Useful if the page resets for a login. Defaults to FALSE.
#' @export
#' @examples
#' \dontrun{
#' shiny::callModule(shinypopup, "myTerms", accepted = FALSE)
#' }
shinypopup <- function(input, output, session, accepted = FALSE) {

  # #If the user has already accepted the card, don't show it again
  if(!accepted){
    #Send over a message to the javascript to initialize the popup code
    observe({ session$sendCustomMessage(type = "initialize_popup", message = "hey") })
  }

  result <- reactive({ accepted })

  #wait for the user to press the acceptButton
  observeEvent(input$acceptButton,{
    session$sendCustomMessage(type = "killPopup", message = "killPopup")
    result <- TRUE
  })
  #give back the choice.
  # The user's data, parsed into a data frame
  result <- reactive({

    if(input$acceptButton > 0){
      session$sendCustomMessage(type = "killPopup", message = "killPopup")
      choice = "accepted"
    } else {
      choice = "not accepted"
    }
    return(choice)
  })

  return(result)
}
