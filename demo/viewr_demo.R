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
  titlePanel("Shinyviewr"),
  hr(),
  fluidRow(
    column(width = 8,
           shinyviewrOutput("myVideo"))
  )
)


server <- function(input, output) {

  #server side call of the viewr module
  output$myVideo <- renderShinyviewr({
    shinyviewr(message = 'hi')
  })


}

# Run the application
shinyApp(ui = ui, server = server)
