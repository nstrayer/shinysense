library(shiny)
library(shinysense)
library(tidyverse)

# Define UI for application that draws a histogram
ui <- fluidPage(
  titlePanel("shinymovr demo"),
  p("Click on the button below to record accelorameter from your phone."),
  shinymovrUI("movr_button"),
  plotOutput("movementPlot")
)

# Define server logic required to draw a histogram
server <- function(input, output) {

  #object to hold all your recordings in to plot
  rvs <- reactiveValues(
    movements = data_frame(index = 0, x = 0, y = 0, z = 0)
  )

  movement <- callModule(shinymovr, "movr_button")


  observeEvent(movement(), {
    rvs$movements <- movement() %>%
      mutate(index = 1:length(x))

    # Generate a plot of the recording we just made
    output$movementPlot <- renderPlot({
      ggplot(rvs$movements, aes(x = index, y = z)) +
        geom_line()
    })
  })

}

# Run the application
shinyApp(ui = ui, server = server, options = list("host" = "0.0.0.0", "port" = 1410))
