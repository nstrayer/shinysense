#
# A small demo app for the shinydrawr without any data function
#
# devtools::install_github("nstrayer/shinysense")
library(shiny)
library(shinysense)
library(tidyverse)

compare_to_beta <- function(user_drawn, shape1, shape2){
  #drawn from beta at all the same x values as our drawn data.
  beta_draw <- dbeta(user_drawn$x, shape1, shape2)

  #we need to normalize the drawn curve somehow so we will make the max value be the same as the beta draws. Probably not smart.
  scale_factor <- max(beta_draw)/max(user_drawn$y_drawn)

  #find average vertical difference between the curves.
  differences <- abs(scale_factor*(user_drawn$y_drawn) - beta_draw)
  sum(differences)/ length(beta_draw)
}


find_best_params <- function(
  user_drawn,
  n = 20,
  shape1_range = c(1,5),
  shape2_range = c(1,5)
){
  shape_params <- expand.grid(
    shape1 = seq(shape1_range[1], shape1_range[2], length.out = n),
    shape2 = seq(shape2_range[1], shape2_range[2], length.out = n)
  ) %>%
    mutate(difference = NA)

  for(i in 1:dim(shape_params)[1]){
    shape_params$difference[i] <-
      compare_to_beta(user_drawn,
                      shape1 = shape_params$shape1[i],
                      shape2 = shape_params$shape2[i]
      )
  }

  shape_params %>%
    filter(difference == min(difference))
}



plot_draw_to_beta <- function(user_drawn, shape1, shape2){
  user_drawn %>%
    mutate(beta_draw = dbeta(user_drawn$x, shape1, shape2) ) %>%
    rename(user_drawn = y_drawn) %>%
    mutate(user_drawn = user_drawn * max(beta_draw)/max(user_drawn)) %>%
    gather(source, y, -x) %>%
    ggplot(aes(x = x, y = y, color = source)) +
    geom_line() +
    labs(title = paste("alpha =", round(shape1,2), "beta =", round(shape2,2)) )
}



find_fit_plot <- function(user_drawn,
                          n = 40,
                          shape1_range = c(1,8),
                          shape2_range = c(1,8) ) {
  best_values <- find_best_params(user_drawn, n, shape1_range, shape2_range)

  best_plot <- plot_draw_to_beta(user_drawn, best_values$shape1, best_values$shape2)

  list(
    shape1 = best_values$shape1,
    shape2 = best_values$shape2,
    meanAvgDiff = best_values$difference,
    plot = best_plot
  )
}


ui <- fluidPage(
  titlePanel("Draw your (beta) prior"),
  p("On the plot below sketch the distribution you think is appropriate for your beta prior. The app will then try and figure out the beta pdf that best fits your drawing by minimizing the mean average difference between your drawing and the pdf.",
    "After drawing the app will plot your drawing next to the closest beta pdf it found along with the alpha and beta values to re-generate that pdf."),
  p("This was inspired by a talk I had with Andrew Bray of Reed College at UseR!2017. It was built using shiny and my shinysense package"),
  fluidRow(
    column(6,
           h2("Draw:"),
           shinydrawrUI("user_distribution")
    ),
    column(6,
           h2("Fit Result:"),
           plotOutput("best_beta_fit"),
           downloadButton('downloadData', 'download my drawing')
    )
  ),
  hr(),
  p("If this is exciting to you make sure to head over to the shinysense project's", a(href = "https://github.com/nstrayer/shinysense", "github page"), "where you can find all the code.")
)


server <- function(input, output) {

  random_data <- data_frame(
    prob    = seq(0, 1, length.out = 50),
    y_value = seq(0, 1, length.out = 50)
  )

  #server side call of the drawr module
  drawChart <- callModule(shinydrawr,
                          "user_distribution",
                          random_data,
                          raw_draw = T,
                          x_key = "prob",
                          y_key = "y_value",
                          y_max = 4)

  #logic for what happens after a user has drawn their values. Note this will fire on editing again too.
  observeEvent(drawChart(), {
    drawnValues = drawChart()

    drawn_data <- random_data %>%
      mutate(drawn = drawnValues) %>%
      select(x = prob, y_drawn = drawn)

    best_beta_fit <- find_fit_plot(drawn_data)

    output$best_beta_fit <- renderPlot({ best_beta_fit$plot })
    output$beta_value <- renderText({
      as.character(best_beta_fit$shape2)
    })

    output$alpha_value <- renderText({
      as.character(best_beta_fit$shape1)
    })

    output$displayDrawn <- renderTable(drawn_data)


    output$downloadData <- downloadHandler(
      filename = "my_drawing.csv",
      content = function(file) {
        write.csv(drawn_data, file)
      }
    )
  })

}

# Run the application
shinyApp(ui = ui, server = server)
