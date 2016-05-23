var controls = {
    backBtn: 	    document.getElementById('backBtn'),
    playBtn: 	    document.getElementById('playBtn'),
    pauseBtn: 	    document.getElementById('pauseBtn'),
    stopBtn: 	    document.getElementById('stopBtn'),
    forwardBtn:     document.getElementById('forwardBtn'),
    volumeBtn:	    document.getElementById('volumeBtn'),
    playlistBtn:    document.getElementById('showPlaylistBtn')
};


controls.playlistBtn.addEventListener('click',  function() { playlistWidget.togglePlaylist(); } );
controls.volumeBtn.addEventListener('input',    function() { changeVolume(this); });
controls.playBtn.addEventListener('click',      function() { context.resume(); } );
controls.pauseBtn.addEventListener('click',     function() { context.suspend(); } );
controls.stopBtn.addEventListener('click',      function() { source.stop(); } );

controls.backBtn.addEventListener('click',      function() {
    var previousSong = playlist.getPreviousSong();
    if (previousSong) processFile(previousSong);
});

controls.forwardBtn.addEventListener('click',   function() {
    var nextSong = playlist.getNextSong();
    if (nextSong) processFile(nextSong);
} );

