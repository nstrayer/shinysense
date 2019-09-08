#' Run demo apps
#' Load and play with simple demo apps using the different senses available in shinysense. Currently supports
#' `draw_distribution` which allows the user to draw a beta distribution and get its parameters.
#' @param demo_name Name of demo app to run. Options `{'draw_distribution'}`.
#'
#' @return Shiny app instance
#' @export
#'
#' @examples
#' run_demo('draw_distribution')
run_demo <- function(demo_name){

  # Grab app script location
  app_script <- system.file(paste0('demo_apps/', demo_name, '.R'), package = 'shinysense')

  # Run app
  shiny::shinyAppFile(app_script)
}
