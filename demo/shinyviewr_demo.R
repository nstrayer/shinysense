#
# A small demo app for the shinyviewr function
#
# devtools::install_github("nstrayer/shinysense")
library(shiny)
library(shinythemes)
library(shinysense)
library(tidyverse)


ui <- fluidPage(
  theme = shinytheme("flatly"),
  titlePanel("Shinyviewr!"),
  hr(),
  fluidRow(
    column(width = 8,
           shinyviewrUI("myCamera", height = '200px')),
    column(width = 3, offset = 1,
           h2("Taken Photo"),
           imageOutput("snapshot")
    )
  )
)


server <- function(input, output) {

  #server side call of the drawr module
  myCamera <- callModule(shinyviewr,"myCamera", outputWidth = 500, outputHeight = 500)
  # myCamera <- callModule(shinyviewr,"myCamera")

  #logic for what happens after a user has drawn their values. Note this will fire on editing again too.
  observeEvent(myCamera(), {
    print(dim(myCamera()))
    rastered_photo <- as.raster(myCamera())
    output$snapshot <- renderPlot({plot(rastered_photo, main = 'My Photo!')})
})

}

# Run the application
shinyApp(ui = ui, server = server)
