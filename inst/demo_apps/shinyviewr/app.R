# devtools::install_github("nstrayer/shinysense")
library(shiny)
library(shinysense)
library(tidyverse)

ui <- fluidPage(
  titlePanel("Shinyviewr!"),
  hr(),
  fluidRow(
    column(
      width = 8,
      shinyviewr_UI("my_camera", height = '400px')
    ),
    column(
      width = 3,
      offset = 1,
      h2("Taken Photo"),
      imageOutput("snapshot")
    )
  )
)


server <- function(input, output) {

  camera_snapshot <- callModule(
    shinyviewr,
    'my_camera',
    output_width = 250,
    output_height = 250
  )

  output$snapshot <- renderPlot({
    req(camera_snapshot())
    plot(camera_snapshot(), main = 'My Photo!')
  })
}

# Run the application
shinyApp(ui = ui, server = server)
