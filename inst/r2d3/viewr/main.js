// !preview r2d3 data = NULL, dependencies = "d3-jetpack"

const container = d3.select('#htmlwidget_container').html('');
const shutter = container.append('center').append('button')
  .text('Take Photo!')
  .st({
    width: '80%',
    height: '40px',
    fontSize: '24px',
    fontFamily: 'Optima'
  });

const video = container.append('center')
  .append('video')
  .at({
    width: 380,
    height: 380,
    autoplay: true,
    playsinline: true,
  })
  .st({
    maxWidth: '100%',
    maxHeight: '80%',
  }).node();
const photoDeck = container.append('div')
  .classed('photoDeck', true)
  .st({
    display: 'flex',
    flexWrap: 'wrap',
    width: `${width}px`,
 });


if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
 navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
 video.src = window.URL.createObjectURL(stream);
 video.play();

 shutter.on('click', () => {
  const canvas = photoDeck.append('canvas').st({
    width: '180px',
    height: '100px',
    magin: '10px',
  });
  const ctx = canvas.node().getContext('2d');
  ctx.drawImage(video, 0,0, 180, 140);
});

 });
}


