# devtools::install_github("nstrayer/shinysense")
library(shiny)
library(shinysense)
library(tidyverse)


ui <- fluidPage(
  titlePanel("shinydrawr"),
  hr(),
  fluidRow(
    column(
      width = 8,
      shinydrawr_UI("drawr_widget", height = '300px')
    ),
    column(
      width = 3,
      offset = 1,
      h2("Drawn values:"),
      tableOutput("displayDrawn")
    )
  )
)


server <- function(input, output) {
  data <- tibble(time = 1:30, metric = time * sin(time / 6) + rnorm(30))

  drawr_widget <- callModule(
    shinydrawr,
    'drawr_widget',
    data,
    x_col = time,
    y_col = metric,
    draw_start = 20
  )

  output$displayDrawn <- renderTable(drawr_widget())
}

# Run the application
shinyApp(ui = ui, server = server)
