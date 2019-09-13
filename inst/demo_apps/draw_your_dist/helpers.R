# helper functions for fitting a beta to a drawing



#generates a big grid of beta values to search over for best value.
generate_beta_values <- function(num_x, param_res, alpha_range, beta_range){
  shape_params <- expand.grid(
    x      = seq(0,1, length.out = num_x),
    shape1 = seq(alpha_range[1], alpha_range[2], length.out = param_res),
    shape2 = seq(beta_range[1],   beta_range[2], length.out = param_res)
  ) %>%
    filter(shape1 > 0 & shape2 > 0) %>%
    mutate(prob = dbeta(x, shape1, shape2))
}


#takes a beta values dataframe and a user drawn one.
#returns the best estimate of both alpha and beta along with a dataframe of the two values over x for plotting.
find_best_fit <- function(drawn, betas){
  drawn_round <- drawn %>% mutate(x = round(x, 5))
  betas_round <- betas %>% mutate(x = round(x, 5))

  joined <- betas_round %>%
    left_join(drawn_round, by = "x") %>%
    filter(!is.na(prob) & !is.infinite(prob)) %>%
    group_by(shape1,shape2) %>%
    mutate(scaled_drawn = y_drawn * (max(prob)/max(y_drawn) ) ) %>%
    ungroup() %>%
    mutate(abs_difference = abs(prob - scaled_drawn)) %>%
    group_by(shape1,shape2) %>%
    mutate(avg_mean_diff = mean(abs_difference)) %>%
    ungroup() %>%
    filter(avg_mean_diff == min(avg_mean_diff))

  list(
    shape1 = joined$shape1[1],
    shape2 = joined$shape2[1],
    joined = joined %>% select(x, `fit dist` = prob, drawn = scaled_drawn)
  )
}

#wraps other functions together into a more convenient call for the app.
find_best_params <- function(
  drawn,
  initial_betas,
  param_res
){
  #check best fit with the cached data.
  initial_best <- find_best_fit(drawn, initial_betas)

  #build a new alpha and beta range to scan over.
  new_alpha_range <- c(initial_best$shape1 - 0.5, initial_best$shape1 + 0.5)
  new_beta_range  <- c(initial_best$shape2 - 0.5, initial_best$shape2 + 0.5)

  print(sprintf("Fitting second itteration of fitting algorithm with alpha = %3.3f, beta = %3.3f",
                initial_best$shape1, initial_best$shape2))

  #generate the new beta values with these more focused ranges.
  new_betas <- generate_beta_values(
    length(drawn$x),
    param_res,
    new_alpha_range,
    new_beta_range    )

  #find best fit in this list.
  find_best_fit(drawn, new_betas)
}


plot_draw_to_beta <- function(best_fit){
  alpha <- best_fit$shape1
  beta  <- best_fit$shape2

  best_fit$joined %>%
    gather(source, y, -x) %>%
    ggplot(aes(x = x, y = y, color = source)) +
    geom_line(size = 1.3, alpha = 0.85) +
    labs(title = sprintf("alpha = %3.2f | beta = %3.2f", round(alpha,2), round(beta,2)) ) +
    theme_minimal() +
    theme(
      title = element_text(hjust = 0.5, size = 18),
      legend.title = element_blank(),
      legend.text = element_text(size = 18))
}


find_fit_plot <- function(user_drawn, initial_betas, param_res){

  best_values <- find_best_params(user_drawn, initial_betas, param_res)

  best_plot <- plot_draw_to_beta(best_values)

  list(
    shape1 = best_values$shape1,
    shape2 = best_values$shape2,
    meanAvgDiff = best_values$difference,
    plot = best_plot
  )
}
