var controls = {
    backBtn: 	    document.getElementById('backBtn'),
    playBtn: 	    document.getElementById('playBtn'),
    pauseBtn: 	    document.getElementById('pauseBtn'),
    stopBtn: 	    document.getElementById('stopBtn'),
    forwardBtn:     document.getElementById('forwardBtn'),
    volumeBtn:	    document.getElementById('volumeBtn'),
    playlistBtn:    document.getElementById('showPlaylistBtn'),
    
    positionSlider: document.getElementById('positionSlider')

};


controls.playlistBtn.addEventListener('click',  function() {
    playlist.togglePlaylist();
} );

controls.volumeBtn.addEventListener('input',    function() {
    //changeVolume(this);
});

controls.playBtn.addEventListener('click',      function() {
    $audio.play();
} );

controls.pauseBtn.addEventListener('click',     function() {
    $audio.pause();
} );

controls.stopBtn.addEventListener('click',      function() {

} );

controls.backBtn.addEventListener('click',      function() {
    
    var song = playlist.goBack();
    if (song) {
        $audio.src = song.getBlobUrl();
        $audio.play();
    }
});

controls.forwardBtn.addEventListener('click',   function() {
    var song = playlist.goForward();
    if (song) {
        $audio.src = song.getBlobUrl();
        $audio.play();
    }
} );

controls.positionSlider.addEventListener('input', function() {
    $audio.currentTime = ($audio.duration * this.value) / this.max;
});


