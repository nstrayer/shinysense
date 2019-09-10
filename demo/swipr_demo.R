#App is a simple card with some content and a little output below that represents the last swipes result.

# devtools::install_github("nstrayer/shinysense")
library(shinysense)
library(shiny)
library(fortunes)

ui <- fixedPage(
  h1("Stats Quotes"),
  p("This is a simple demo of the R package shinyswipr. Swipe on the quote card below to store your rating. What each direction (up, down, left, right) mean is up to you. (We won't tell.)"),
  hr(),
  shinyswiprUI( "quote_swiper",
                h4("Swipe Me!"),
                hr(),
                h4("Quote:"),
                textOutput("quote"),
                h4("Author(s):"),
                textOutput("quote_author")
  ),
  hr(),
  h4("Swipe History"),
  tableOutput("resultsTable")
)

server <- function(input, output, session) {
  card_swipe <- callModule(shinyswipr, "quote_swiper")

  quote               <- fortune()
  output$quote        <- renderText({ quote$quote })
  output$quote_author <- renderText({ paste0("-",quote$author) })
  output$resultsTable <- renderDataTable({appVals$swipes})

  appVals <- reactiveValues(
    quote  = quote,
    swipes = data.frame(quote = character(), author = character(), swipe = character())
  )

  observeEvent( card_swipe(),{
    #Record our last swipe results.
    appVals$swipes <- rbind(
      data.frame(quote  = appVals$quote$quote,
                 author = appVals$quote$author,
                 swipe  = card_swipe()
      ),
      appVals$swipes
    )
    #send results to the output.
    output$resultsTable <- renderTable({appVals$swipes})

    #update the quote
    appVals$quote <- fortune()

    #send update to the ui.
    output$quote <- renderText({ appVals$quote$quote })
    output$quote_author <- renderText({ paste0("-",appVals$quote$author) })
  }) #close event observe.
}

shinyApp(ui, server)
