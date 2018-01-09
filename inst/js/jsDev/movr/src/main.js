// import GyroNorm from 'gyronorm';
// can't get the webpack build working so I am using a script tag.
/* global GyroNorm */


console.log('hello, world!');

const gn = new GyroNorm();

gn.init().then(function(){
  gn.start(function(data){

    
    console.log(`x:${data.dm.gx}, y:${data.dm.gy}, z:${data.dm.gz}`);
   
    // console.log(`alpha:${data.dm.alpha}, beta:${data.dm.beta}, gamma:${data.dm.gamma}`);

  });
}).catch(function(e){
  // Catch if the DeviceOrientation or DeviceMotion is not supported by the browser or device
});