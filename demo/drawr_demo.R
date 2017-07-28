#
# A small demo app for the shinydrawr function
#
# devtools::install_github("nstrayer/shinysense")
library(shiny)
library(shinythemes)
library(shinysense)
library(tidyverse)


ui <- fluidPage(
  theme = shinytheme("flatly"),
  titlePanel("shinydrawr demo"),
  p("Try and guess the rest of the chart below"),
  p(
    "A big thanks to Adam Pearce who put code up for",
    a(href = "https://bl.ocks.org/1wheel/07d9040c3422dac16bd5be741433ff1e", "implementing the drag to draw technique!"),
    "If this is exciting to you make sure to head over to the project's",
    a(href = "https://github.com/nstrayer/shinysense", "github page"),
    "where you can find all the code."
  ),
  hr(),
  fluidRow(
    column(width = 8,
           shinydrawrUI("outbreak_stats")),
    column(width = 3, offset = 1,
           h2("Drawn values:"), tableOutput("displayDrawn"))
  )
)


server <- function(input, output) {
  random_data <- data_frame(time = 1:30,
                            metric = time * sin(time / 6) + rnorm(30))

  random_data$metric[c(3,4,5)] = NA

  #server side call of the drawr module
  drawChart <- callModule(
    shinydrawr,
    "outbreak_stats",
    data = random_data,
    draw_start = 15,
    x_key = "time",
    y_key = "metric",
    y_max = 20,
    y_min = -50
  )

  #logic for what happens after a user has drawn their values. Note this will fire on editing again too.
  observeEvent(drawChart(), {
    drawnValues = drawChart()

    drawn_data <- random_data %>%
      filter(time >= 15) %>%
      mutate(drawn = drawnValues)

    output$displayDrawn <- renderTable(drawn_data)
  })

}

# Run the application
shinyApp(ui = ui, server = server)
