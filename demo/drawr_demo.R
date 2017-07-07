#
# A small demo app for the shinydrawr function
#
# devtools::install_github("nstrayer/shinysense")
library(shiny)
library(shinysense)
library(tidyverse)


ui <- fluidPage(
  titlePanel("shinydrawr demo"),
  p("Try and guess the rest of the chart below"),
  hr(),
  shinydrawrUI("outbreak_stats"),
  h2("Drawn values:"),
  tableOutput("displayDrawn"),
  hr(),
  p("A big thanks to Adam Pearce who put code up for",  a(href = "https://bl.ocks.org/1wheel/07d9040c3422dac16bd5be741433ff1e", "implementing the drag to draw technique!")),
  p("If this is exciting to you make sure to head over to the project's", a(href = "https://github.com/nstrayer/shinysense", "github page"), "where you can find all the code.")
)


server <- function(input, output) {

  random_data <- data_frame(
    time = 1:30,
    metric = time*sin(time/6) + rnorm(30)
  )

  #server side call of the drawr module
  drawChart <- callModule(shinydrawr,
                          "outbreak_stats",
                          random_data,
                          raw_draw = T,
                          draw_start = 1,
                          x_key = "time",
                          y_key = "metric",
                          y_max = 20)

  #logic for what happens after a user has drawn their values. Note this will fire on editing again too.
  observeEvent(drawChart(), {
    drawnValues = drawChart()

    drawn_data <- random_data %>%
      filter(time >= 1) %>%
      mutate(drawn = drawnValues)

    output$displayDrawn <- renderTable(drawn_data)
  })

}

# Run the application
shinyApp(ui = ui, server = server)
