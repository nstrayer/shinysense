#App is a simple card with some content and a little output below that represents the last swipes result.

library(shiny)
library(shinysense)

ui <- fixedPage(
  shinypopupUI("terms",
    buttonText = "I accept these demands",
    popupDiv = div(
      h1("Warning"),
      p("There be dragons ahead"),
      p("Click the button below to pass into dangerous territory")
    ),
    h1("welcome to my super cool app"),
    p("This is some sensitive content. Good thing you accepted our terms or else you wouldnt get to see this.")
  )

)

server <- function(input, output, session) {
  terms_of_use <- callModule(shinypopup, "terms", accepted = F)

  observe({
    print("button was clicked")
    # print(terms_of_use())
  })
}

shinyApp(ui, server)
