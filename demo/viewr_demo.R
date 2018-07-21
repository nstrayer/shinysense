#
# A small demo app for the shinyviewr function
#
# devtools::install_github("nstrayer/shinysense")
library(shiny)
library(shinythemes)
library(shinysense)
library(tidyverse)
library(base64enc)


ui <- fluidPage(
  theme = shinytheme("flatly"),
  titlePanel("Shinyviewr"),
  hr(),
  fluidRow(
    column(width = 8,
           viewr_widgetOutput("myVideo"))
  ),
  imageOutput("snapshot")
)


server <- function(input, output) {

  #server side call of the viewr module
  output$myVideo <- renderViewr_widget({
    viewr_widget(message = 'hi')
  })

  observeEvent(input$myVideo_photo, {

    output$snapshot <- renderPlot({
      photo <- input$myVideo_photo %>%
        str_remove('data:image/png;base64,') %>%
        str_replace(' ', '+') %>%
        base64enc::base64decode() %>%
        png::readPNG()

      rastered_photo <- as.raster(photo)
      plot(rastered_photo, main = 'My Photo!')
    })
  })

}

# Run the application
shinyApp(ui = ui, server = server)
