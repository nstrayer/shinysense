<p align = 'right'>
  <a href = "http://jhudatascience.org/"> 
    <img src = "https://raw.githubusercontent.com/jhudsl/drawyourprior/master/WWW/jhu_logo.png" height=40 />
  </a>
</p>

<p align = 'center'>
  <img src = "https://github.com/nstrayer/shinysense/raw/master/inst/images/shinysense_wide.png?raw=true" height=120/>
</p>

# `shinysense`

A series of [shiny modules](https://www.rstudio.com/resources/webinars/understanding-shiny-modules/) to help shiny sense the world around it.

It's called `shinysense` because `shinyinputs` seemed kinda lame.

## Senses present:

Currently the package supports the following 'senses'.

### Touch
- `drawr` & `shinydrawr`: Draws a line chart that obscures the end of the results, the user then draws what they think the rest of the chart is and then the rest of the chart is revealed. 
  - Blatently stolen from the New York Times article [You Draw It: What Got Better or
Worse During Obama’s Presidency](https://www.nytimes.com/interactive/2017/01/15/us/politics/you-draw-obama-legacy.html).
- `shinyswipr`: Embeds a card that can be swiped in different directions, the swipe direction is returned to shiny. 


### Vision
- `shinyviewr`: Record images from a webcam or any other camera connected to browser viewing app.

### Hearing
- `shinylistenr`: Records audio on a button press and returns the fast-fourier transformed signal to the server.

### Motion
- `shinymovr`: Capture and return accelerometer data from your phone or tablet.
  - Used in [this cast spells shiny app](https://jhubiostatistics.shinyapps.io/cast_spells/) to classify spell cast motions using deep learning. 


## Testing it out

Every sense included in the package has a demo app. To run the demo app you can run the included function `run_demo()` and pass it the name of the function you want to see. 

E.g. 
```r
shinysense::run_demo('shinyviewr')
```

This will run a basic demo application that includes the code behind the app. Giving you a jumping off point for including the function in your app!

Available demos include

- `'shinydrawr'`
- `'shinyviewr'`
- `'shinyswipr' `
- `'shinymovr'`
- `'shinylistenr'`
- `'draw_your_dist'`: A demo app using `shinydrawr` to fit a beta distribution to a drawn line.


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


## Naming Scheme

The names of the functions follow a few general rules. 

- The shiny-based functions are all prefixed with `shiny`. E.g. `shinyswipr`, `shinydrawr`...

- Of those shiny-based functions there are two functions per sense, the server function (just plain name), and the UI function, which has `_UI` appended to the end. 

_Note that if you used shinysense in earlier versions, this naming scheme was inconsistant, I sincerely appologize for any frustration this may cause!_

- For functions that work outside of shiny there is no `shiny` prefix. 
  - Currently this only includes `drawr` which allows you to embed a you-draw-it chart in a static report, and `run_demo` which starts up the demo apps for the various senses. 


## Browser security

Recently browsers have been making large steps to protect user's data. This is great, however, it means that it can sometimes be tricky to get these applications working. Almost everything will require a secure connection to work. Secure connection generally means two things: one the website address includes `https://` at the front, meaning that all data passed between the browser and server is encrypted, or the app is being run locally and acessed with `localhost`. 

The easiest way to experiment with these functions is to run a local rstudio instance on your laptop or desktop and then run the shiny app in the browser. When hosting an app for public consumption make sure you have an ssl encrypted server (I.e. `https`).

A workaround for using Rstudio Server on a remote server that is not secured with `https` is to do port forwarding with the `ssh` command. E.g. `ssh -L 127.0.0.1:8787: 127.0.0.1:8787 me@my_servers_address`. This will allow you to use `localhost` for your apps. 


## Nothing works, what do I do?
The probability of there being bugs in these functions is unfortunately high. If you've found one I would be delighted if you could file a new issue [here](https://github.com/nstrayer/shinysense/issues). I'll try my best to at least respond.
