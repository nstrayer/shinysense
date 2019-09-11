#' Run shinysense demo apps
#'
#' Run demo apps Load and play with simple demo apps using the different senses
#' available in shinysense. See `demo_name` parameter for available demos.
#'
#' @param demo_name Name of demo app to run. Options \{'shinydrawr',
#'   'shinyviewr', 'shinyswipr', 'shinymovr', 'shinylistenr'\}.
#' @param show_code See the underlying code for the demo app? Defaults to
#'   \code{TRUE}.
#'
#' @return Shiny app instance
#'
#' @examples
#' \dontrun{
#' run_demo('shinydrawr')
#' }
#' @export
run_demo <- function(demo_name, show_code = TRUE) {
  available_demos <-
    c('shinydrawr',
      'shinyviewr',
      'shinyswipr',
      'shinymovr',
      'shinylistenr')
  if (!(demo_name %in% available_demos)) {
    stop(
      glue::glue(
        "{demo_name} is not an available demo. Available demos are: {paste(available_demos, collapse = ', ')}."
      )
    )
  }

  # Grab app script location
  app_script <-
    system.file(paste0('demo_apps/', demo_name, '/app.R'), package = 'shinysense')

  # Run app
  run_options <- if (show_code) c('display.mode' = 'showcase') else c()

  shiny::shinyAppFile(app_script, options = run_options)
}
