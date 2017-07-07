#
# A small demo app for the shinydrawr without any data function
#
# devtools::install_github("nstrayer/shinysense")
library(shiny)
library(shinysense)
library(tidyverse)


ui <- fluidPage(
  titlePanel("shinydrawr demo"),
  h4("Draw you favorite distribution below. "),
  p("This was inspired by a talk I had with Andrew Bray of Reed College at UseR!2017. Currently you just draw a distirbution but in the future this could be used for bayesian inference with drawn priors."),
  div(span("To enable this functionality a new argument has been added called"),
      code(raw_draw),
      span("to allow arbitrary drawing without a line added simple set it to true.")
      ),
  hr(),
  shinydrawrUI("user_distribution"),
  h2("Drawn values:"),
  tableOutput("displayDrawn"),
  hr(),
  p("If this is exciting to you make sure to head over to the project's", a(href = "https://github.com/nstrayer/shinysense", "github page"), "where you can find all the code.")
)


server <- function(input, output) {

  random_data <- data_frame(
    time = seq(-5, 5, length.out = 50),
    y_value = seq(0, 1, length.out = 50)
  )

  #server side call of the drawr module
  drawChart <- callModule(shinydrawr,
                          "user_distribution",
                          random_data,
                          raw_draw = T,
                          draw_start = -5,
                          x_key = "time",
                          y_key = "y_value",
                          y_max = 3)

  #logic for what happens after a user has drawn their values. Note this will fire on editing again too.
  observeEvent(drawChart(), {
    drawnValues = drawChart()

    drawn_data <- random_data %>%
      filter(time >= -5) %>%
      mutate(drawn = drawnValues)

    output$displayDrawn <- renderTable(drawn_data)
  })

}

# Run the application
shinyApp(ui = ui, server = server)
