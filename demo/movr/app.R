library(shiny)
# devtools::install_github("nstrayer/shinysense")
library(shinysense)
library(tidyverse)

# Define UI for application that draws a histogram
ui <- fluidPage(
  titlePanel("shinymovr demo"),
  p("Click on the button below, shake your phone around, then click it again to see the acceloration data from your movement. In addition, you can add a label to your gesture and then export the data for all your model training desires!"),

  fluidRow(
    div(
      style = "height:100%;",
      column(
        4, offset = 1,
        shinymovrUI("movr_button")
      ),
      column(
        6,
        textInput("label", "gesture label"),
        offset = 1
      )
    )
  ),
  plotOutput("movementPlot"),
  downloadButton("downloadData", "download your data"),
  hr(),
  p("If this is exciting to you make sure to head over to the project's", a(href = "https://github.com/nstrayer/shinysense/blob/master/demo/movr_demo.R", "github page"), "where you can find the code to recreate this demo.")
)

# Define server logic required to draw a histogram
server <- function(input, output) {

  # object to hold all your recordings in to plot
  rvs <- reactiveValues(
    movements = NA,
    counter = 0
  )

  movement <- callModule(
    shinymovr, "movr_button",
    time_limit = 2,
    movements = c('x', 'y', 'z'),
    orientations = FALSE,
    recording_message = "RECORDING!"
  )


  observeEvent(movement(), {
    new_movement <- movement() %>%
      gather(direction, accel, -time) %>%
      mutate(label = input$label, recording_num = paste("gesture", rvs$counter))

    print(new_movement %>% group_by(direction) %>% summarise(
      max_val = max(accel)
    ))

    # rvs$movements <- new_movement
    if (rvs$counter == 0) {
      rvs$movements <- new_movement
    } else {
      rvs$movements <- rvs$movements %>%
        bind_rows(new_movement) %>%
        filter(recording_num != "gesture 0")
    }

    rvs$counter <- rvs$counter + 1

    # Generate a plot of the recording we just made
    output$movementPlot <- renderPlot({
      ggplot(rvs$movements, aes(x = time, y = accel)) +
        geom_line(aes(color = direction)) +
        facet_wrap(~paste0(recording_num, "|", label), scales = "free_x") +
        theme(
          axis.text.x = element_blank()
        )
    })

    output$downloadData <- downloadHandler(
      filename = "my_gestures.csv",
      content = function(file) {
        write.csv(rvs$movements, file)
      }
    )
  })
}

# Run the application
shinyApp(ui = ui, server = server, options = list(
  "host" = "0.0.0.0",
  "port" = 1410,
  "display.mode" = "showcase"
))
# runApp(appDir = "/Users/nick/rpackages/shinysense/demo/movr_demo.R", display.mode = "showcase")
# shinyApp(ui = ui, server = server)
