function processSong(song) {
    
    var file = song.getFile();

	$buffering.className = '';

    if (!context) context = new AudioContext();
	var reader 	= new FileReader();
    
    reader.addEventListener('load', function(event) {
    	var data = event.target.result;
		
        context.decodeAudioData(data, function(buffer) {
        	playSong(buffer);
        });
        
    });
    reader.readAsArrayBuffer(file);
}


function playSong(buffer) {
    naturalFlow = true;
    source.buffer 	= buffer;
	source.connect(gainNode);
    
	source.onended = function() {
        stopEventHandler();
    };

	gainNode.connect(context.destination);
    source.start(0);
    console.log('Playlist size: ' + playlist.getSize());
    console.log('Current song: ' + playlist.getCurrentSong().getName());
    $buffering.className += 'hidden';
}


function stopEventHandler() {
    console.log('song finished - natural flow: ' + naturalFlow);

    if (naturalFlow) {              // song ends by itself, not forced by user. We must set next song.
        playlist.setCurrentSong(playlist.getNextSong());
    }

    var newSong = playlist.getCurrentSong();
    if (newSong) {
        source = context.createBufferSource();
        processSong(newSong);
    }
}


function changeVolume(element) {
	var volume   = element.value;
	var fraction = parseInt(volume) / parseInt(element.max);

	// x*x curve (x-squared). Simple linear (x) does not sound as good.
	gainNode.gain.value = fraction * fraction;
}

var playlistWidget  = new PlaylistWidget();
var playlist        = new Playlist();
var context 	    = new AudioContext();
var gainNode 	    = context.createGain();
var source 		    = context.createBufferSource();
var naturalFlow     = true;         // true when no jumps in songs are made by user clicking stop/back/ff btns




