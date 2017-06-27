class shinymovr{
  constructor(params){

    this.isOn = false;       //are we currently recording data?
    this.movement_data = []; //holds the most recent recordings data.
    this.send_dest = params.destination + "movement";
    this.watcher = this.make_watcher(params);
    document.getElementById(params.id).addEventListener("click", this.toggleButton.bind(this), true);
  }

  make_watcher(params){
    params.dom_target     = params.id;
    params.onMoveFunction = this.gather.bind(this);    //function that accumulates data while recording.
    return acceljs.accel(params);
  }

  gather(data){
    this.movement_data.push(data);
  }

  dump(){
    return this.movement_data;
  }

  clear_data(){
    this.movement_data = [];
  }

  sendToShiny(){
    //alert(JSON.stringify(this.movement_data));
    //const move_data = this.movement_data;
    const destination = this.send_dest;
    Shiny.onInputChange(destination, JSON.stringify(this.movement_data));
  }

  toggleButton(){
    if(this.isOn){
      this.watcher.turnOff();
      this.sendToShiny();
    } else {
      this.clear_data();          //reset the data for a new recording.
      this.watcher.turnOn(); //turn on the motion tracking again.
    }
    this.isOn = !this.isOn;
  };

}



$(document).on('shiny:connected', event => {
    console.log("shiny is connected.");

    //watch for message from server saying it's ready.
    Shiny.addCustomMessageHandler("initialize_movr",
        params =>  new shinymovr(params)
    );


});
