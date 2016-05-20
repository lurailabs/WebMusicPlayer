var controls = {
    backBtn: 	    document.getElementById('backBtn'),
    playBtn: 	    document.getElementById('playBtn'),
    pauseBtn: 	    document.getElementById('pauseBtn'),
    stopBtn: 	    document.getElementById('stopBtn'),
    forwardBtn:     document.getElementById('forwardBtn'),
    volumeBtn:	    document.getElementById('volumeBtn'),
    playlistBtn:    document.getElementById('showPlaylistBtn')
};

var $playlistTitle = document.querySelector('#playlist h1');

var $playlist 	= document.getElementById('playlist');

controls.volumeBtn.addEventListener('input', function() { changeVolume(this); });
controls.playBtn.addEventListener('click',   function() { context.resume(); } );
controls.pauseBtn.addEventListener('click',  function() { context.suspend(); } );
controls.stopBtn.addEventListener('click', function() {} );
controls.backBtn.addEventListener('click', function() {} );
controls.forwardBtn.addEventListener('click', function() {} );

/*
    Toggles playlist column
 */
controls.playlistBtn.addEventListener('click', togglePlaylist );
$playlistTitle.addEventListener('click', togglePlaylist );

function togglePlaylist() {
    $playlist.classList.contains('hidden') ?
        $playlist.classList.remove('hidden') :
        $playlist.classList.add('hidden');
}