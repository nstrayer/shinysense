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
           shinyviewrUI("myCamera")),
    column(width = 3, offset = 1,
           h2("Taken Photo"),
           imageOutput("snapshot")
    )
  )
)


server <- function(input, output) {

  #server side call of the drawr module
  myCamera <- callModule(shinyviewr,"myCamera")

  #logic for what happens after a user has drawn their values. Note this will fire on editing again too.
  observeEvent(myCamera(), {
    photo <- myCamera() %>%
      str_remove('data:image/png;base64,') %>%
      str_replace(' ', '+') %>%
      base64enc::base64decode() %>%
      png::readPNG()

    rastered_photo <- as.raster(photo)
    output$snapshot <- renderPlot({plot(rastered_photo, main = 'My Photo!')})
})

}

# Run the application
shinyApp(ui = ui, server = server)
