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
  titlePanel("shinydrawr no reveal"),
  hr(),
  fluidRow(
    column(width = 8,
           shinydrawrUI("outbreak_stats")),
    column(width = 3, offset = 1,
           h2("Drawn values:"), tableOutput("displayDrawn"))
  )
)


server <- function(input, output) {
  random_data <- data_frame(time = 1:30, metric = time * sin(time / 6) + rnorm(30)) %>%
    mutate(metric = ifelse(time > 20, NA, metric))

  # random_data$metric[c(3,4,5)] = NA
  cutoff <- 20
  #server side call of the drawr module
  drawChart <- callModule(
    shinydrawr,
    "outbreak_stats",
    data = random_data,
    draw_start = cutoff,
    x_key = "time",
    y_key = "metric",
    y_max = 20,
    y_min = -50
  )

  #logic for what happens after a user has drawn their values. Note this will fire on editing again too.
  observeEvent(drawChart(), {
    drawnValues = drawChart()

    drawn_data <- random_data %>%
      filter(time >= cutoff) %>%
      mutate(drawn = drawnValues)

    output$displayDrawn <- renderTable(drawn_data)
  })

}

# Run the application
shinyApp(ui = ui, server = server)
