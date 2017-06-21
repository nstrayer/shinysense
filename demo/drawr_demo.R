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
  p("If this is exciting to you make sure to head over to the project's", a(href = "https://github.com/nstrayer/shinyearr/tree/master/demo", "github page"), "where you can find all the code.")
)


server <- function(input, output) {

  random_data <- data_frame(
    time = 1:30,
    metric = time*sin(time/6) + rnorm(30)
  )

  #object to hold all your recordings in to plot
  rvs <- reactiveValues(
    true_data = random_data,
    user_data = random_data
  )

  drawChart <- callModule(shinydrawr,
                          "outbreak_stats",
                          random_data,
                          draw_start = 15,
                          x_key = "time",
                          y_key = "metric")


  # observeEvent(recorder(), {
  #   my_recording <- recorder()
  #
  #   rvs$counter <- rvs$counter + 1
  #   rvs$recordings <- rbind(
  #     data_frame(value = my_recording, frequency = 1:256, num = paste("recording", rvs$counter), label = input$label),
  #     rvs$recordings
  #   ) %>% mutate(num = fct_inorder(num))
  #
  #   # Generate a plot of the recording we just made
  #   output$frequencyPlot <- renderPlot({
  #
  #     ggplot(rvs$recordings, aes(x = frequency, y = value)) +
  #       geom_line() +
  #       geom_text(aes(label = label), x = 255, y = 100,
  #                 color = "steelblue", size = 16, hjust = 1) +
  #       facet_wrap(~num) +
  #       labs(title = "Frequency bins from recording")
  #
  #   })
  # })

}

# Run the application
shinyApp(ui = ui, server = server)
