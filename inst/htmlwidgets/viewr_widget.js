HTMLWidgets.widget({

  name: 'viewr_widget',

  type: 'output',

  factory: function(el, width, height) {

    const container = d3.select(el).html('');
    const shutter_height = 40;
    const shutter = container.append('center').append('button')
      .text('Take Photo!')
      .style('width', '50%')
      .style('max-width', '300px')
      .style('height', `${shutter_height}px`)
      .style('font-size', '24px')
      .style('font-family', 'Optima');

    const video = container.append('center')
      .append('video')
      .attr('width', width)
      .attr('height', height-shutter_height)
      .attr('autoplay', true)
      .attr('playsinline', true)
      .style('max-width', '100%')
      .node();

    const canvas = container
      .append('canvas')
      .style('display', 'none')
      .attr('width', `${video.width}px`)
      .attr('height', `${video.height}px`)
      .style('width', `${video.width}px`)
      .style('height', `${video.height}px`);

    const ctx = canvas.node().getContext('2d');

    return {

      renderValue: function(x) {
        const {outputWidth, outputHeight} = x;

        canvas
          .attr('width', outputWidth)
          .attr('height', outputHeight);

        if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices
            .getUserMedia({ video: true })
            .then(function(stream) {
               video.src = window.URL.createObjectURL(stream);
               video.play();
               shutter.on('click', () => {

                 // draw current video frame to the invisible canvas element
                 ctx.drawImage(video, 0, 0, outputWidth, outputHeight);

                 // send the current canvas state to shiny as a base64 encoded string.
                 Shiny.onInputChange(
                   el.id + "_photo",
                   canvas.node().toDataURL("image/png")
                 );
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
