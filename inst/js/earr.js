class get_audio{
    constructor(interval_length, full_data = false){
        console.log("initializing get_audio object");

        this.int_length = interval_length; //how frequently do we refresh data
        this.full_data = full_data;        //do we send back all frames or just an average?

        this.recording_data = [];          //array to store the sound data.
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.context = new AudioContext();
        this.analyser = this.context.createAnalyser();
        this.analyser.fftSize = 512;  //make this a managable size pls


        //run the get media request for audio only
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then( (stream) => {

                //locate where our audio is coming from
                this.source = this.context.createMediaStreamSource(stream);

                // //connect our source to this analyser
                this.source.connect(this.analyser);
                //
                // var gainNode = this.context.createGain();
                // this.source.connect(gainNode);
                // gainNode.connect(this.context.destination);
                // // Reduce the volume.
                // gainNode.gain.value = 0.0;

                //connect our analyser to context
                // this.analyser.connect(this.context.destination);


        }, function () { });
    }

    startRecording(){
        var frame_number = 1;

        this.record_interval = setInterval( () => {
            var array = new Uint8Array(this.analyser.frequencyBinCount);
            this.analyser.getByteFrequencyData(array);
            this.recording_data.push(
                {frame: frame_number, frequency: array}
            );
            frame_number++;
            console.log(array);
        }, this.int_length);
    }

    stopRecording(){
        console.log("stopping recording");
        clearInterval(this.record_interval ); //kill recording loop

        var returned_data = []; //holder for our data return

        //if we stopped before anything was recorded, send nothing.
        if(this.recording_data.length === 0){
            return;
        }
        //only send back the frames in which there was sound.
        this.recording_data.forEach(rec => {
            //add all frequencies to check if anything was recorded
            var freq_total = rec.frequency.reduce((total,f) => total + f);

            //if something was recorded, push it to the results.
            if(freq_total !== 0) { returned_data.push(rec) }
        });

        this.recording_data = []; //reset the data holder

        return this.full_data ? returned_data : this.average_freqs(returned_data); //give the user the data they desire.
    }

    average_freqs(data){
        var totals = new Array(data[0].frequency.length).fill(0);

        data.forEach( frame => {
            var freq_vals = frame.frequency;

            freq_vals.forEach((f,i) => {
                totals[i] += f; //add results.
            });
        });
        return totals.map(v => v/data.length);
    }
}

class shinyearr{
    constructor(id){
        console.log("initializing recorder with id", id);

        this.id = id;
        this.button = $("#" + id + "-recordButton");
        this.recording = false;

        this.setUpRecorder();
        this.setUpClick();
    }

    setUpRecorder(){
        console.log("Initializing the recorder!");
        this.recorder = new get_audio(300);
    }

    setUpClick(){
        //add an event listener.
        this.button.click( () => {

            //if we arent currently recording, start to.
            if(this.recording === false){
                this.recorder.startRecording();

                //start pulse animation
                this.button.addClass("pulsing");
                this.button.text("Stop Recording");
            } else { //otherwise kill the recording
                var recording = this.recorder.stopRecording();
                console.log("sending data to shiny!");
                this.sendToShiny(recording);

                //kill pulse animation
                this.button.removeClass("pulsing");
                this.button.text("Start Recording");
            }

            //update recording variable
            this.recording = !(this.recording);
        });

        console.log("Watching the button", this.button);
    }

    sendToShiny(data){
        var send_dest = this.id + "-recordingEnded";
        console.log(send_dest);
        Shiny.onInputChange(send_dest, data);
    }
}

$(document).on('shiny:connected', event => {
    console.log("shiny is connected.");

    var buttons = [];

    //watch for message from server saying it's ready.
    Shiny.addCustomMessageHandler("initialize_recorder",
        buttonID => {
            var newButton = new shinyearr(buttonID);
            buttons.push(newButton); //store new recording button
        }
    );


});
