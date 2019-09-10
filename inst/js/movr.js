/*global Shiny */
// we need the gx gy gz fields, not the plain x,y,z so we can check and add this if neccesary when picking.
const add_g = (d) => ['x', 'y', 'z'].includes(d) ? `g${d}`: d;

const pick_fields = (obj, fields, prepend) => fields
  .reduce((subset, key) => Object.assign(
    subset,
    {[`${prepend}_${key}`]: obj[key]}
  ), {});

function movr_recorder({
  target,                // button we are attaching the start and stop to.
  after_recording,       // function called after recording has finished
  movement_directions = ['x', 'y', 'z', 'alpha', 'beta', 'gamma'], // controls what data is given back.
  orientation_directions = ['alpha', 'beta', 'gamma'],
  graceful_fail = false, // do we give the user a loud alert when their device doesn't support motion?
  time_lim = -1, // is this a timed recording? Aka record for 2 seconds then stop? If yes pass number of seconds to record for.
  recording_message = 'Recording Movement...'
}){

  console.log('using the new version of shinsense')

  // keep track of if recording is happening
  let recording = false;

  const timed = time_lim > 0;
  let start_time = 0;

  // gather default button text
  const resting_text = target.innerHTML;

  // object that holds all the data for a given recording session.
  let data_store = [];

  // setup the object
  const gn = new GyroNorm();

  gn.init()
    .then(initialize_recorder)
    .catch(error_handler);

  // Sets up event listener on button (or whatever object passed)
  function initialize_recorder(){
    target.addEventListener('click', click_behavior);
  }

  function click_behavior(){
    if(recording){
      gn.stop();

      // pass accumulated data to the callback
      after_recording(data_store);

      // empty data store for next recording
      data_store = [];

      // reset the button text
      target.innerHTML = resting_text;
    } else {
      // setup new start time
      start_time = Date.now();

      // kick off data logging
      gn.start(log_data);

      // change button text to indicate recording status
      target.innerHTML = recording_message;
    }

    // flip recording indicator
    recording = !recording;
  }

  // if the browser doesn't suport the motion capture give an error
  function error_handler(e){
    const error_msg = 'looks like no device motion is supported on this device :(';
    console.log(e);
    if(graceful_fail){
        console.log(error_msg);
    } else {
       alert(error_msg);
    }
  }

  function log_data(data){
    const seconds_since_start = (Date.now() - start_time) / 1000;

    data_store.push(
      Object.assign(
        movement_directions ? pick_fields(data.dm, movement_directions, 'm'): {},
        orientation_directions ? pick_fields(data.do, orientation_directions, 'o'): {},
        {time: seconds_since_start}
      )
    );

    const timer_on_and_done = timed && (seconds_since_start  > time_lim);
    if(timer_on_and_done){
      click_behavior()
    }
  }
}

$(document).on('shiny:connected', event => {
  console.log("shiny is connected.");


    //watch for message from server saying it's ready.
  Shiny.addCustomMessageHandler("initialize_movr", params => {

    // callback for sending data back to server
    const sendToShiny = (data) => {
      const destination = params.destination + "movement";
      Shiny.onInputChange(destination, JSON.stringify(data))
    };

    // select dom element we're targeting
    const target = document.getElementById(params.id);

    // call recorder
    movr_recorder(Object.assign(
      {target, after_recording: sendToShiny},
      params
    )
  );
  })
})
