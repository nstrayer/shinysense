#App is a simple card with some content and a little output below that represents the last swipes result.
library(shinysense)
library(shiny)
library(fortunes)

ui <- fixedPage(
  shinySwiprUI( "swiper1",
                h1("Stats Quotes"),
                hr(),
                h3("Rate this quote:"),
                textOutput("quote"),
                textOutput("quote_author"),
                hr(),
                htmlOutput("card_swipe",container = tags$p)
  ),
  hr(),
  dataTableOutput("resultsTable")
)

server <- function(input, output, session) {
  card_swipe <- callModule(shinySwipr, "swiper1")

  appVals <- reactiveValues(
    quote = fortune(),
    swipes = data.frame(quote = character(), author = character(), swipe = character())
  )

  our_quote <- isolate(appVals$quote)

  output$quote <- renderText({ our_quote$quote })
  output$quote_author <- renderText({ paste0("-",our_quote$author) })
  output$resultsTable <- renderDataTable({appVals$swipes})

  observeEvent( card_swipe(),{
    #Record our last swipe results.
    appVals$swipes <- rbind(
      data.frame(quote = appVals$quote$quote,
                 author = appVals$quote$author,
                 swipe = card_swipe()
      ),
      appVals$swipes
    )
    #send results to the output.
    output$resultsTable <- renderDataTable({appVals$swipes})

    #update the quote
    appVals$quote <- fortune()

    #send update to the ui.
    output$quote <- renderText({
      appVals$quote$quote
    })

    output$quote_author <- renderText({
      paste0("-",appVals$quote$author)
    })
  }) #close event observe.


  output$card_swipe <- renderUI({
    if(is.null(card_swipe())){
      "You didn't swipe yet. Do it!"
    } else{
      paste("You",card_swipe(), "swiped the last quote.")
    }
  })
}

shinyApp(ui, server)
