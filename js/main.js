

function processFile(file) {

	$buffering.className = '';

	var reader 	= new FileReader();
    
    reader.addEventListener('load', function(event) {
    	var data = event.target.result;
    	
    	// ID3 tag info is in last 128 bytes
    	//var length = data.byteLength;
    	//readID3tags( new DataView(data, length-128, 128) );
    	//readID3tags(data);

        context.decodeAudioData(data, function(buffer) {
        	playSong(buffer);
        });
        
    });
    reader.readAsArrayBuffer(file);
}



function playSong(buffer) {
	var source 		= context.createBufferSource();
    source.buffer 	= buffer;
	// Connect the source to the gain node.
	source.connect(gainNode);
	source.onended = function() { console.log('song finished') };
	// Connect the gain node to the destination.
	gainNode.connect(context.destination);
    source.start(0);
    $buffering.className += 'hidden';
}


function changeVolume(element) {
	var volume   = element.value;
	var fraction = parseInt(volume) / parseInt(element.max);

	// x*x curve (x-squared). Simple linear (x) does not sound as good.
	gainNode.gain.value = fraction * fraction;
}

var playlist    = new Playlist();
var context 	= new AudioContext();
var gainNode 	= context.createGain();




