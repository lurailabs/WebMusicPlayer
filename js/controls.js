var controls = {
    backBtn: 	    document.getElementById('backBtn'),
    playBtn: 	    document.getElementById('playBtn'),
    pauseBtn: 	    document.getElementById('pauseBtn'),
    stopBtn: 	    document.getElementById('stopBtn'),
    forwardBtn:     document.getElementById('forwardBtn'),
    volumeBtn:	    document.getElementById('volumeBtn'),
    playlistBtn:    document.getElementById('showPlaylistBtn'),

    disable:        function(btn) { controls[btn].classList.add('disabled'); },
    enable:         function(btn) { controls[btn].classList.remove('disabled'); }
};


controls.playlistBtn.addEventListener('click',  function() {
    playlistWidget.togglePlaylist();
} );

controls.volumeBtn.addEventListener('input',    function() {
    changeVolume(this);
});

controls.playBtn.addEventListener('click',      function() {
    context.resume();
} );

controls.pauseBtn.addEventListener('click',     function() {
    context.suspend();
} );

controls.stopBtn.addEventListener('click',      function() {
    if (source.buffer) {
        playlist.setCurrentSong(null);
        naturalFlow = false;
        source.stop();
    }
} );

controls.backBtn.addEventListener('click',      function() {
    if (source.buffer) {
        var previousSong = playlist.getPreviousSong();
        if (previousSong) {
            playlist.setCurrentSong(previousSong);
            naturalFlow = false;
            source.stop();
        }
    }
});

controls.forwardBtn.addEventListener('click',   function() {
    if (source.buffer) {
        var nextSong = playlist.getNextSong();
        if (nextSong) {
            playlist.setCurrentSong(nextSong);
            naturalFlow = false;
            source.stop();
        }
    }
} );
