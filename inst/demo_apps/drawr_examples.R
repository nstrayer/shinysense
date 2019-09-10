plot_data <- dplyr::tibble(x = 1:50, value = sin(x))

# Free draw mode
drawr(
  plot_data,
  free_draw = TRUE,
  x_col = x,
  title = 'Free Drawr',
  y_range = c(-5,5),
)

# Standard mode
drawr(
  plot_data,
  x_col = x,
  y_col = value,
  title = 'Standard Drawr',
  draw_start = 25
)

drawr(
  plot_data,
  x_col = x,
  y_col = y,
  title = 'Draw whole line',
  y_range = c(-5,5)
)

drawr(
  plot_data,
  x_col = x,
  y_col = y,
  title = 'No start pin',
  y_range = c(-5,5),
  draw_start = 25,
  pin_start = FALSE
)
