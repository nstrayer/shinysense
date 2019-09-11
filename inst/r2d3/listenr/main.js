// !preview r2d3 data=list(button_text = 'Record Audio'), container = 'div', dependencies = 'd3-jetpack', css = here::here('inst/r2d3/listenr/styles.css')

class get_audio{
  constructor(interval_length, full_data = false){

    this.int_length = interval_length; //how frequently do we refresh data
    this.full_data = full_data;        //do we send back all frames or just an average?

    this.recording_data = [];          //array to store the sound data.
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.context = new AudioContext();
    this.analyser = this.context.createAnalyser();
    this.analyser.fftSize = 512;  //make this a managable size pls

    //run the get media request for audio only
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then( (stream) => {
        //locate where our audio is coming from
        this.source = this.context.createMediaStreamSource(stream);

        // //connect our source to this analyser
        this.source.connect(this.analyser);
      }, function () { });
  }

  startRecording(){
    var frame_number = 1;

    this.record_interval = setInterval( () => {
        const array = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(array);
        this.recording_data.push({
          frame: frame_number,
          frequency: array
        });
        frame_number++;
    }, this.int_length);
  }

  finishRecording(){
    clearInterval(this.record_interval); //kill recording loop

    var returned_data = []; //holder for our data return

    //if we stopped before anything was recorded, send nothing.
    if(this.recording_data.length === 0)  return;

    //only send back the frames in which there was sound.
    this.recording_data.forEach(rec => {
      //add all frequencies to check if anything was recorded
      const freq_total = rec.frequency.reduce((total,f) => total + f);

      //if something was recorded, push it to the results.
      if(freq_total !== 0) { returned_data.push(rec) }
    });

    this.recording_data = []; //reset the data holder

    return this.full_data ?
      returned_data :
      this.average_freqs(returned_data); //give the user the data they desire.
  }

  average_freqs(data){
    const totals = new Array(data[0].frequency.length).fill(0);

    data.forEach( frame => {
      const freq_vals = frame.frequency;

      freq_vals.forEach((f,i) => {
        totals[i] += f; //add results.
      });
    });
    return totals.map(v => v/data.length);
  }
}

const {
  button_text = 'Record',
  while_recording_text = 'Stop Recording',
  shiny_message_loc = 'my_shiny_app',
} = data;

const is_shiny_app = typeof Shiny !== 'undefined';

div.classed('button_container', true);
const record_button = div.selectAppend('button.record_button')
  .text(button_text);

let recording = false;

const recorder = new get_audio(300);

record_button.on('click', function(){

  //if we arent currently recording, start to.
  if(recording === false){
    recorder.startRecording();

    //start pulse animation
    record_button.classed("pulsing", true);
    record_button.text(while_recording_text);
  } else {
    //otherwise kill the recording and send to shiny
    const recording_results = recorder.finishRecording();

    if(is_shiny_app){
      Shiny.onInputChange(
        shiny_message_loc,
        recording_results
      );
    }

    //kill pulse animation
    record_button.classed("pulsing", false);
    record_button.text(button_text);
  }

  // Toggle recording variable
  recording = !recording;
});





