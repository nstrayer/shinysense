#' Run demo apps
#' Load and play with simple demo apps using the different senses available in shinysense. Currently supports
#' `draw_distribution` which allows the user to draw a beta distribution and get its parameters.`swipr` which demos basic
#' usage of cards and decision recording with `shinyswipr`.
#' @param demo_name Name of demo app to run. Options `{'shinydrawr', 'shinyviewr', 'shinyswipr'}`.
#' @param show_code See the underlying code for the demo app? Defaults to `TRUE`./
#'
#' @return Shiny app instance
#' @export
#'
#' @examples
#' run_demo('shinydrawr')
run_demo <- function(demo_name, show_code = TRUE){

  # Grab app script location
  app_script <- system.file(paste0('demo_apps/', demo_name, '/app.R'), package = 'shinysense')

  # Run app
  run_options <- if (show_code) c('display.mode' = 'showcase') else c()

  shiny::shinyAppFile(app_script, options = run_options)
}
