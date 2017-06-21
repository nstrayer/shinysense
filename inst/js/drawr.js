var data = [
  {"year": 2001, "debt": 31.4},
  {"year": 2002, "debt": 32.6},
  {"year": 2003, "debt": 34.5},
  {"year": 2004, "debt": 35.5},
  {"year": 2005, "debt": 35.6},
  {"year": 2006, "debt": 35.3},
  {"year": 2007, "debt": 35.2},
  {"year": 2008, "debt": 39.3},
  {"year": 2009, "debt": 52.3},
  {"year": 2010, "debt": 60.9},
  {"year": 2011, "debt": 65.9},
  {"year": 2012, "debt": 70.4},
  {"year": 2013, "debt": 72.6},
  {"year": 2014, "debt": 74.4},
  {"year": 2015, "debt": 73.6},
];


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
        }
    );


});
