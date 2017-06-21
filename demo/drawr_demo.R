#
# A small demo app for the shinydrawr function
#
# devtools::install_github("nstrayer/shinysense")

library(shiny)
library(shinysense)
library(tidyverse)
library(forcats)


ui <- fluidPage(
  titlePanel("shinydrawr demo"),
  p("Try and guess the rest of the chart below"),
  hr(),
  shinydrawrUI("outbreak_stats"),
  h2("Drawn values:"),
  tableOutput("displayDrawn"),
  hr(),
  p("If this is exciting to you make sure to head over to the project's", a(href = "https://github.com/nstrayer/shinyearr/tree/master/demo", "github page"), "where you can find all the code.")
)


server <- function(input, output) {

  random_data <- data_frame(
    time = 1:30,
    metric = time*sin(time/6) + rnorm(30)
  )

  #object to hold all your recordings in to plot
  rvs <- reactiveValues(
    user_data = "nothing yet!"
  )

  drawChart <- callModule(shinydrawr,
                          "outbreak_stats",
                          random_data,
                          draw_start = 15,
                          x_key = "time",
                          y_key = "metric")

  observeEvent(drawChart(), {
    drawnValues = drawChart()
    # print(drawnValues[2])
    drawn_data <- random_data %>%
      filter(time >= 15) %>%
      mutate(drawn = drawnValues)

    output$displayDrawn <- renderTable(drawn_data)
  })

}

# Run the application
shinyApp(ui = ui, server = server)
