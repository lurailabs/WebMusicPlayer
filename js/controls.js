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
    if($audio.src) $audio.volume = this.value / this.max;
});

controls.playBtn.addEventListener('click',      function() {
    if ($audio.src) $audio.play();
} );

controls.pauseBtn.addEventListener('click',     function() {
    $audio.pause();
} );

controls.backBtn.addEventListener('click',      function() {
    if (!$audio.src) return;
    var song = playlist.goBack();
    if (song) {
        $audio.src = song.getBlobUrl();
        $audio.play();
    }
});

controls.forwardBtn.addEventListener('click',   function() {
    if (!$audio.src) return;
    var song = playlist.goForward();
    if (song) {
        $audio.src = song.getBlobUrl();
        $audio.play();
    }
} );

controls.positionSlider.addEventListener('input', function() {
    if($audio.src) $audio.currentTime = ($audio.duration * this.value) / this.max;
});


