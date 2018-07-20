HTMLWidgets.widget({

  name: 'shinyviewr',

  type: 'output',

  factory: function(el, width, height) {

    // TODO: define shared variables for this instance
    const container = d3.select(el).html('');

    debugger;

    return {

      renderValue: function(x) {

        // TODO: code to render the widget, e.g.
        const shutter = container.append('center').append('button')
          .text('Take Photo!')
          .style('width', '80%')
          .style('height', '40px')
          .style('font-size', '24px')
          .style('font-family', 'Optima');

        const video = container.append('center')
          .append('video')
          .attr('width', 380)
          .attr('height', 380)
          .attr('autoplay', true)
          .attr('playsinline', true)
          .style('max-width', '100%')
          .style('max-height', '80%')
          .node();

        const photoDeck = container.append('div')
          .classed('photoDeck', true)
          .style('display', 'flex')
          .style('flexWrap', 'wrap')
          .style('width', `${width}px`);


        if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices
            .getUserMedia({ video: true })
            .then(function(stream) {
               video.src = window.URL.createObjectURL(stream);
               video.play();

               shutter.on('click', () => {
                 const canvas = photoDeck
                   .append('canvas')
                   .style('width', '180px')
                   .style('height', '140px')
                   .style('margin', '10px');


                 const ctx = canvas.node().getContext('2d');
                 ctx.drawImage(video, 0,0, 180, 140);

                 const data = ctx.getImageData(0, 0, 180, 140);
                 console.log(JSON.stringify(data));
               }); // end on('click')

            }); // end .then
          } // end if

      },

      resize: function(width, height) {

        // TODO: code to re-render the widget with a new size

      }

    };
  }
});

// !preview r2d3 dependencies = "d3-jetpack"
//
// r2d3: https://rstudio.github.io/r2d3
//
