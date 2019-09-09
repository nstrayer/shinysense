// !preview r2d3 data = NULL, container = 'div', options = list(shiny_message_loc = 'my_shiny_app'), dependencies = "d3-jetpack"

const {shiny_message_loc, shiny_ready_loc = 'ready_for_photo', output_size} = options;

const image_size = Object.assign({width: 300, height: 300}, output_size);

const shutter_text = {
  taking: 'Sending photo...',
  ready: 'Take photo!',
};

const is_shiny_app = typeof Shiny !== 'undefined';

const shutter = div.selectAppend('button')
  .text(shutter_text.ready)
  .st({
    width: '80%',
    height: '40px',
    fontSize: '24px',
    fontFamily: 'Optima'
  });

const camera_stream = div.selectAppend('video')
  .at({
    width: image_size.width,
    height: image_size.height,
    autoplay: true,
    playsinline: true,
  })
  .st({
    width: `${image_size.width}px`,
    height:`${image_size.height}px`,
    objectFit: 'cover',
    maxWidth: '100%',
    maxHeight: '80%',
  }).node();

const photo_holder = div.selectAppend('canvas.photo_holder')
   .at(image_size)
   .st({
      width: `${image_size.width}px`,
      height:`${image_size.height}px`,
      display: 'none',
    })
    .node();

shutter.on('click', function(){

  shutter.text(shutter_text.taking);
  // Append a snapshot of video canvas element context
  photo_holder
    .getContext('2d')
    .drawImage(camera_stream, 0, 0, image_size.width, image_size.height);

  // Grab photo data as a dataurl
  const photo_data = photo_holder.toDataURL("image/png");

  // Send to shiny if needed.
  if(is_shiny_app){
    Shiny.onInputChange(shiny_message_loc, photo_data);
  }
});

 // Attach the video stream to the video element and autoplay.
navigator.mediaDevices
  .getUserMedia({ video: image_size })
  .then(stream => camera_stream.srcObject = stream );

// Wait for a message from shiny letting us know it got the image.
if(is_shiny_app){
  // Handle message from shiny saying photo was received.
  Shiny.addCustomMessageHandler(
    shiny_ready_loc,
    message => {
      // Replace shutter text with default.
      shutter.text(shutter_text.ready);
    });
}
