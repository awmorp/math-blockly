var videoState = 0;
var handle;

function playPause() {
  if( videoState == 2 ) { // Fading out
    if( handle ) {
      window.clearTimeout( handle );
      handle = null;
    } else {
      fadeoutStep();
    }
  } else if( videoState == 3 ) {
    if( handle ) {
      window.clearTimeout( handle );
      handle = null;
    } else {
      fadeinStep();
    }
  } else {
    if( videoElement.paused ) {
      videoElement.play();
    } else {
      videoElement.pause();
    }
  }
}

function nextVideo() {
//  console.log( "nextVideo" );
  videoIndex++;
  if( videoIndex >= videoSources.length ) videoIndex = 0;
  var pauseState = videoElement.paused;
  videoElement.src = videoSources[videoIndex];
  videoState = 3; // Fading in
  handle = window.setTimeout( fadeinStep, 30 );
//  if( pauseState ) {
//    videoElement.pause();
//  } else {
//    videoElement.play();
//  }
}

function videoEnded() {
//  console.log( "videoEnded" );
  videoState = 2; // Fading out
  handle = window.setTimeout( fadeoutStep, 500 );
}

function fadeinStep() {
//  console.log( "fadein" );
  if( Number( videoElement.style.opacity ) < 0.95 ) {
    videoElement.style.opacity = Number( videoElement.style.opacity ) + 0.05;
    handle = window.setTimeout(  fadeinStep, 30 );
  } else {
    videoElement.style.opacity = 1;
    videoState = 1; // Playing
    videoElement.play();
  }
}

function fadeoutStep() {
//  console.log( "fadeout" );
  if( Number( videoElement.style.opacity ) > 0.05 ) {
    videoElement.style.opacity = Number( videoElement.style.opacity ) - 0.05;
    handle = window.setTimeout( fadeoutStep, 30 );
  } else {
    videoElement.style.opacity = 0;
    nextVideo();
  }
}
