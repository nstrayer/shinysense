<p align = 'right'>
  <a href = "http://jhudatascience.org/"> 
    <img src = "https://raw.githubusercontent.com/jhudsl/drawyourprior/master/WWW/jhu_logo.png" height=40 />
  </a>
</p>

# `shinysense`

A series of [shiny modules](https://www.rstudio.com/resources/webinars/understanding-shiny-modules/) to help shiny sense the world around it.

It's called `shinysense` because `shinyinputs` seemed kinda lame.

## How do I use it?

`shinysense` is not currently on CRAN. To install it use the `devtools` github function.

```r
devtools::install_github("nstrayer/shinysense")
```

Once the app is installed just included it in your shiny app the way you usually would:

```r
#my super cool shiny app
library(shiny)
library(shinysense)
```

There currently is no website for the documentation to reside in, but all the functions are documented. To figure out how to use these see the demo code posted below or just in R do the standard documentation search.

```r
#I have no idea how these ridiculous functions work!
?shinydrawr
?shinydrawrUI
#oh, I still have no idea.
```

## Senses present:

## `shinyswipr`

Embeds a card that can be swiped in different directions, the swipe direction is returned to shiny. [Demo.](https://nickstrayer.shinyapps.io/shinysense_swipr_demo/) [Code](https://github.com/nstrayer/shinysense/blob/master/demo/swipr_demo.R)
      
- Used in our app [`papr`.](https://jhubiostatistics.shinyapps.io/papr/)
      

```r
# ui.R
shinyswiprUI( 
  "quote_swiper",
  div( 
    # Content can be any ui elements you want. 
    textOutput("quote")
  )
)

# server.R
# Reactive function containing swipe direction as character 
# card_swipe() == 'Up' etc. 
card_swipe <- callModule(shinyswipr, "quote_swiper")
```

## `shinydrawr`
Draws a line chart that obscures the end of the results, the user then draws what they think the rest of the chart is and then the rest of the chart is revealed. 
[Demo.](https://nstrayer.shinyapps.io/drawr_demo/) [Code.](https://github.com/nstrayer/shinysense/blob/master/demo/drawr_demo.R)

- See [this blog post](http://livefreeordichotomize.com/2017/07/27/new-and-improved-draw-charts-in-shinysense/) on how to use draw charts inside and outside of shiny.
- Blatently stolen from the New York Times article [You Draw It: What Got Better or
Worse During Obama’s Presidency](https://www.nytimes.com/interactive/2017/01/15/us/politics/you-draw-obama-legacy.html).

```r
# ui.R
shinydrawrUI("outbreak_stats")

# server.R
drawChart <- callModule(
    shinydrawr,
    "outbreak_stats",
    data = data,
    draw_start = cutoff,
    x_key = "time",
    y_key = "metric"
  )
```

## `shinyearr`

Records audio on a button press and returns the fast-fourier transformed signal to the server.

[Demo.](https://nickstrayer.shinyapps.io/shinysense_earr_demo/)  [Code.](https://github.com/nstrayer/shinysense/blob/master/demo/earr_demo.R)

```r
# ui.R
shinyearrUI("my_recorder")

# server.R
recorder <- callModule(shinyearr, "my_recorder")
```

## `shinyviewr`
Record images from a webcam.

[Demo.](https://nstrayer.shinyapps.io/viewr_imagenet/)
[Code.](https://github.com/nstrayer/shinysense/blob/master/demo/shinyviewr_demo.R)
```r
#ui.R
shinyviewrUI("myCamera", height = '200px'))

#server.R
myCamera <- callModule(shinyviewr,"myCamera", outputWidth = 500, outputHeight = 500)
```
      

## `shinymovr`

Capture and return accelerometer data from your phone or tablet.

[Demo.](https://nstrayer.shinyapps.io/shinymovr/)  [Code.](https://github.com/nstrayer/shinysense/blob/master/demo/movr/app.R)

```r
# ui.R
shinymovrUI("movr_button")

# server.R
  movement <- callModule(
    shinymovr, "movr_button",
    time_limit = 2,
    recording_message = "RECORDING!"
  )
```


### Helpers
  - `shinypopup` : A lot of times when you're developing an app using the above senses you need to let your user's know you're collecting their data. This module creates a popup that obscures a given section of your app that forces the user to accept your terms before they can go any further.
    - Used in [`papr`](https://jhubiostatistics.shinyapps.io/papr/) to force people to accept our data use agreement.
    - [Demo.](https://nstrayer.shinyapps.io/shinypopup/)  [Code.](https://github.com/nstrayer/shinysense/blob/master/demo/popup_demo.R)


## Nothing works, what do I do?
The probability of there being bugs in these functions is unfortunately high. If you've found one I would be delighted if you could file a new issue [here](https://github.com/nstrayer/shinysense/issues). I'll try my best to at least respond.
