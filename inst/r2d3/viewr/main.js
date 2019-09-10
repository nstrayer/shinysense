// !preview r2d3 data = NULL, container = 'div', options = list(shiny_message_loc = 'my_shiny_app'), dependencies = "d3-jetpack"
const system_font = `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`;

const {
  shiny_message_loc,
  shiny_ready_loc = 'ready_for_photo',
  output_size,
} = options;

const image_size = Object.assign({width: 300, height: 300}, output_size);

const shutter_text = {
  taking: 'Sending photo...',
  ready: 'Take photo!',
};

const no_camera_message = "Shiny can't get access to cameras. This is a privacy consideration. Make sure you are trying from a secure (https, or localhost) site.";

const is_shiny_app = typeof Shiny !== 'undefined';

// ================================================================
// Setup DOM elements
// ================================================================

// Add flex styling to container so things center align
div.st({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const shutter = div.selectAppend('button')
  .text(shutter_text.ready)
  .st({
    width: '80%',
    height: '40px',
    fontSize: '24px',
    borderRadius: '8px',
    fontFamily: system_font,
  });

const camera_chooser = div.selectAppend('select.camera_chooser')
  .style('display', 'none');

const no_camera_alert = div.selectAppend('p')
  .text(no_camera_message)
  .st({
    display: 'none',
    maxWidth: '300px',
    color: 'darkred',
    fontWeight: 'bold'
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
    marginTop: '0.5rem',
  }).node();

const photo_holder = div.selectAppend('canvas.photo_holder')
   .at(image_size)
   .st({
      width: `${image_size.width}px`,
      height:`${image_size.height}px`,
      display: 'none',
    })
    .node();

// ================================================================
// Camera hookup
// ================================================================

// Look for available cameras
if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
  no_camera_alert.style('display', 'block');
  return;
} else {
  // List cameras and microphones.
  navigator.mediaDevices
    .enumerateDevices()
    .then(function(devices) {
      const available_cameras = devices
        .filter(device => device.kind === 'videoinput')
        .map(({deviceId, label}) => ({ id: deviceId, name: label }));

      if(available_cameras.length > 1){
        // Show chooser if we have more than one camera
        camera_chooser
          .style('display', 'block')
          .selectAll('option')
          .data(available_cameras)
          .enter().append('option')
          .attr('value', d => d.id)
          .text(d => d.name);

        camera_chooser
          .on('change', function(d){
            const selected_camera_id = this.value;
            attach_camera_stream(selected_camera_id);
          });
      }
  })
  .catch(function(err) {
    console.log(err.name + ": " + err.message);
  });
}

// Attach the video stream to the video element and autoplay.
function attach_camera_stream(camera_id = null){
  // If we have been given a camera_id to attach to, go to that one
  // if no id specified just go to default.
  const video_constraints = Object.assign(
    image_size,
    camera_id ? {deviceID: camera_id} : {}
  );

  navigator.mediaDevices
    .getUserMedia({
      video: video_constraints
    })
    .then(stream => camera_stream.srcObject = stream );
}

// Initiate camera stream to default camera.
attach_camera_stream();

// ================================================================
// Shutter watcher
// ================================================================
shutter.on('click', function(){

  if(is_shiny_app){
    shutter.text(shutter_text.taking);
  }

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
