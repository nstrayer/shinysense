//logic for returning to shiny goes here.
const sendToShiny = (id) => {
  const send_dest = id + "-doneDragging";

  return (data) => Shiny.onInputChange(send_dest, data.map(d=>d.y))

};

$(document).on('shiny:connected', event => {
    console.log("shiny is connected.");

    //watch for message from server saying it's ready.
    Shiny.addCustomMessageHandler("initialize_chart",
        params => {
          params.dom_target = "#" + params.id + '-youDrawIt'; //where we place the chart
          params.on_done_drawing = sendToShiny(params.id);    //function that sends data back to shiny.
          const ourChart = new youDrawIt(params);             //initialize the chart itself.
          console.log(params);
        }
    );


});
