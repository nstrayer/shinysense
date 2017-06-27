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
    movements = data_frame(index = integer(), x = numeric(), y = numeric(), z = numeric())
  )

  movement <- callModule(shinymovr, "movr_button")


  observeEvent(movement(), {
    my_movement <- movement()
    # print(my_movement)
    rvs$movements <- rbind(
      rvs$movements,
      data_frame(index = 0, x = my_movement$x, y = my_movement$y, z = my_movement$z)
    ) %>% mutate(index = 1:length(x))

    # Generate a plot of the recording we just made
    output$movementPlot <- renderPlot({
      ggplot(rvs$movements, aes(x = index, y = z)) +
        geom_line()
    })
  })

}

# Run the application
shinyApp(ui = ui, server = server, options = c("host" = "0.0.0.0"))
