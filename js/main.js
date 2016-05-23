
function processFile(file) {

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
    if (source.buffer) {
        source.stop();
        source = context.createBufferSource();
    }
    source.buffer 	= buffer;
	// Connect the source to the gain node.
	source.connect(gainNode);
	source.onended = function() { console.log('song finished') };
	// Connect the gain node to the destination.
	gainNode.connect(context.destination);
    source.start(0);
    console.log('Playlist size: ' + playlist.getSize());
    console.log('Current song: ' + playlist.getCurrentSong().name);
    $buffering.className += 'hidden';
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




