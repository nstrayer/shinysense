# `shinysense`

A series of [shiny modules](https://www.rstudio.com/resources/webinars/understanding-shiny-modules/) to help shiny sense the world around it.

It's called `shinysense` because `shinyinputs` seemed kinda lame.

## Senses present:

### Touch
  - `shinyswipr` : Embeds a card that can be swiped in different directions, the swipe direction is returned to shiny.
      - Used in our app [`papr`.](https://jhubiostatistics.shinyapps.io/papr/)
      - [Demo.](https://nickstrayer.shinyapps.io/shinysense_swipr_demo/) [Code for demo.](https://github.com/nstrayer/shinysense/blob/master/demo/swipr_demo.R)
  - `shinydrawr` : Draws a line chart that obscures the end of the results, the user then draws what they think the rest of the chart is and then the rest of the chart is revealed.
      - Blatently stolen from the New York Times article [You Draw It: What Got Better or
Worse During Obama’s Presidency](https://www.nytimes.com/interactive/2017/01/15/us/politics/you-draw-obama-legacy.html).
      - [Demo.](https://nstrayer.shinyapps.io/drawr_demo/) [Code.](https://github.com/nstrayer/shinysense/blob/master/demo/drawr_demo.R)

### Hearing
  - `shinyear` : Records audio on a button press and returns the fast-fourier transformed signal to the server.
      - [Demo.](https://nickstrayer.shinyapps.io/shinysense_earr_demo/)  [Code.](https://github.com/nstrayer/shinysense/blob/master/demo/earr_demo.R)

### Sight
  - `shinysee` : Record images from a a webcam or mobile camera (android only unfortunately).
      - Coming soon.

### Motion
  - `shinymovr` : Capture and return accelerometer data from your phone or tablet.
      - Coming soon.

### Helpers
  - `shinypopup` : A lot of times when you're developing an app using the above senses you need to let your user's know you're collecting their data. This module creates a popup that obscures a given section of your app that forces the user to accept your terms before they can go any further.
    - Used in [`papr`](https://jhubiostatistics.shinyapps.io/papr/) to force people to accept our data use agreement.
    - [Demo.](https://nickstrayer.shinyapps.io/shinypopup/)  [Code.](https://github.com/nstrayer/shinysense/blob/master/demo/popup_demo.R)
