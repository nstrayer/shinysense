const sendToShiny = (id) => {
  const send_dest = id + "movement";
  console.log(send_dest)
  return (data) => Shiny.onInputChange(send_dest, data);

};

$(document).on('shiny:connected', event => {
    console.log("shiny is connected.");

    //watch for message from server saying it's ready.
    Shiny.addCustomMessageHandler("initialize_movr",
        params => {
          params.dom_target     = params.id;
          params.onMoveFunction = sendToShiny(params.destination);    //function that sends data back to shiny.
          console.log(params.id)
          //initialize watch button
          const accelWatch = acceljs.accel(params);
        }
    );


});
