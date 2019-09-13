#
# This is a Shiny web application. You can run the application by clicking
# the 'Run App' button above.
#
# Find out more about building applications with Shiny here:
#
#    http://shiny.rstudio.com/
#

library(dplyr)
library(tidyr)
library(ggplot2)
library(shiny)
library(shinysense)
library(shinythemes)

source(system.file('demo_apps/draw_your_dist/helpers.R', package = 'shinysense'))

# Define UI for application that draws a histogram
ui <- fluidPage(
    theme = shinytheme("flatly"),
    titlePanel("Draw your (beta) prior"),
    p(
        "On the plot below sketch the distribution you think is appropriate for your beta prior. The app will then try and figure out the beta pdf that best fits your drawing by minimizing the mean average difference between your drawing and the pdf.",
        "After drawing the app will plot your drawing next to the closest beta pdf it found along with the alpha and beta values to re-generate that pdf."
    ),
    p(
        "This was inspired by a talk I had with Andrew Bray of Reed College at UseR!2017. It was built using ",
        a(href = "https://shiny.rstudio.com/", "shiny"),
        "and my ",
        a(href = "https://www.github.com/nstrayer/shinysense", "shinysense"),
        " package and was developed at the",
        a(href = "http://jhudatascience.org/", "Johns Hopkins Data Science Lab")
    ),
    fluidRow(
        column(6,
               h3("Draw:"),
               shinydrawr_UI("user_distribution"), height = '300px'),
        column(
            6,
            h3("Fit Result:"),
            plotOutput("best_beta_fit"),
            downloadButton('downloadData', 'download my drawing')
        )
    )
)


###### Constants
param_res     <- 30
number_xs     <- 50
alpha_range   <- c(0,8)
beta_range    <- c(0,8)
initial_betas <- generate_beta_values(num_x = number_xs, param_res, alpha_range, beta_range)

random_data <- tibble(
    prob = seq(0, 1, length.out = number_xs),
    y_value = 0
)

# Define server logic required to draw a histogram
server <- function(input, output) {

    #server side call of the drawr module
    drawChart <- callModule(
        shinydrawr,
        "user_distribution",
        random_data,
        x_col = prob,
        free_draw = TRUE,
        y_range = c(0,4)
    )

    #logic for what happens after a user has drawn their values. Note this will fire on editing again too.
    observeEvent(drawChart(), {

        drawn_data <- drawChart() %>%
            select(x = prob, y_drawn = drawn)

        best_beta_fit <-
            find_fit_plot(drawn_data, initial_betas, param_res)

        output$best_beta_fit <- renderPlot({
            best_beta_fit$plot
        })
        output$beta_value <- renderText({
            as.character(best_beta_fit$shape2)
        })

        output$alpha_value <- renderText({
            as.character(best_beta_fit$shape1)
        })

        output$displayDrawn <- renderTable(drawn_data)

        output$downloadData <- downloadHandler(
            filename = "my_drawing.csv",
            content = function(file)
                write.csv(drawn_data, file)
        )
    }) #close observe event.
}

# Run the application
shinyApp(ui = ui, server = server)
