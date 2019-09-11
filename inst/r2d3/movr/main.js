// !preview r2d3 data=c(0.3, 0.6, 0.8, 0.95, 0.40, 0.20), container = 'div', dependencies = c('d3-jetpack',here::here('inst/js/libraries/gyronorm.js'))

const record_button = div.selectAppend('button.record_button')
  .text('record');

const error_message = div.selectAppend('div.error_message')
  .html(`
    <p>It looks like no device motion is supported on this device :( </p>
    <p>If you're on an iOS device with iOS-12, you can enable device orientation in Settings > Safari > Motion & Orientation Access.</p>
    <p>If you're on an iOS device with iOS-13 you can switch to Chrome.</p>
    <p>If you're on an Android device, this function hasn't been tested so if you could comment on <a href="https://github.com/nstrayer/shinysense/issues/33">this issue</a> on github with your device name and software that would be wonderful!
  `).style('display', 'none');

function show_error(){
  record_button.style('display', 'none');
  error_message.style('display', 'block');
}

const check_enabled = setTimeout(
    () => show_error(),
    500
);

const gn = new GyroNorm();

gn.init()
  .then(initialize_recorder)
  .catch(show_error);

// Sets up event listener on button (or whatever object passed)
function initialize_recorder(){
  record_button.on('click', click_behavior);
}

function click_behavior(){
  console.log('got clicked, yo')
}

window.addEventListener('deviceorientation', event => {
	clearTimeout(check_enabled);
});


