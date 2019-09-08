#
# A small demo app for the shinyearr function
#
# devtools::install_github("nstrayer/shinysense")

library(shiny)
library(shinysense)
library(tidyverse)
library(forcats)

# Define UI for application that draws a histogram
ui <- fluidPage(
  titlePanel("shinyearr demo"),
  p("Click on the button below to record audio from your microphone. After your recording is done a plot will display your data in terms of the fourier transformed signal decomposed into 256 sequential frequencies."),
  p("You can input a label for each recording and then export the results of all your recordings as a tidy csv, perfect for all your machine learning needs!"),
  hr(),
  fluidRow(
    div(style = "height:100%;",
      column(4, offset = 1,
        shinyearrUI("my_recorder")
      ),
      column(6,
        textInput("label", "recording label"),
        offset = 1
      )
    )
  ),
  plotOutput("frequencyPlot"),
  downloadButton('downloadData', 'download your data'),
  hr(),
  p("If this is exciting to you make sure to head over to the project's", a(href = "https://github.com/nstrayer/shinyearr/tree/master/demo", "github page"), "where you can find all the code.")

)

# Define server logic required to draw a histogram
server <- function(input, output) {

  #object to hold all your recordings in to plot
  rvs <- reactiveValues(
    recordings = data_frame(value = numeric(), frequency = integer(), num = character(), label = character()),
    counter = 0
  )

  recorder <- callModule(shinyearr, "my_recorder")

  #initialize plot so it isnt just an empty space.
  output$frequencyPlot <- renderPlot({
    ggplot(rvs$recordings) +
      xlim(0,256) +
      labs(x = "frequency", y = "value") +
      labs(title = "Frequency bins from recording")
  })

  observeEvent(recorder(), {
    my_recording <- recorder()

    rvs$counter <- rvs$counter + 1
    rvs$recordings <- rbind(
      data_frame(value = my_recording, frequency = 1:256, num = paste("recording", rvs$counter), label = input$label),
      rvs$recordings
    ) %>% mutate(num = fct_inorder(num))

    # Generate a plot of the recording we just made
    output$frequencyPlot <- renderPlot({

      ggplot(rvs$recordings, aes(x = frequency, y = value)) +
        geom_line() +
        geom_text(aes(label = label), x = 255, y = 100,
                  color = "steelblue", size = 16, hjust = 1) +
        facet_wrap(~num) +
        labs(title = "Frequency bins from recording")

    })
  })

  output$downloadData <- downloadHandler(
    filename = "my_recordings.csv",
    content = function(file) {
      write.csv(rvs$recordings, file)
    }
  )
}

# Run the application
shinyApp(ui = ui, server = server)
