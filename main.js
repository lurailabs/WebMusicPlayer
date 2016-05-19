function fileHandle(event) {

	event.stopPropagation();
    event.preventDefault();

    var files 	= event.dataTransfer.files; 
    var file 	= null;

    for (var i=0; i<files.length; i++) {
    	var file = files[i];
    	console.log('Name: ' + file.name);
    	//console.log('Type: ' + file.type);
    	//console.log('Size: ' + file.size);
    	//console.log('Last modified: ' + file.lastModifiedDate);

    	if (file.type !== 'audio/mp3') {
    		console.log('Not mp3');
    		continue;
		} else processFile(file);
    }
}



function processFile(file) {

	buffering.className = '';

	var reader 	= new FileReader();
    
    reader.addEventListener('load', function(event) {
    	var data = event.target.result;
    	
    	// ID3 tag info is in last 128 bytes
    	//var length = data.byteLength;
    	//readID3tags( new DataView(data, length-128, 128) );
    	readID3tags(data);

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
	// Connect the gain node to the destination.
	gainNode.connect(context.destination);
    source.start(0);
    buffering.className += 'hidden';
}


function changeVolume(element) {
	var volume   = element.value;
	var fraction = parseInt(element.value) / parseInt(element.max);

	// x*x curve (x-squared). Simple linear (x) does not sound as good.
	gainNode.gain.value = fraction * fraction;
}




/**
*	Drag events
**/

function dragOverHandle(event) {
    event.stopPropagation();
    event.preventDefault();
    dropHere.className = '';
	event.dataTransfer.dropEffect = 'copy';
}


function dragLeaveHandle(event) {
    event.stopPropagation();
    event.preventDefault();
    dropHere.className += 'hidden';
}

function dropHandle(event) {
    event.stopPropagation();
    event.preventDefault();
    dropHere.className += 'hidden';
}


var player 	 	= document.getElementById('player');
var list 		= document.getElementById('list');
var dropHere 	= document.getElementById('dropHereMsg');
var buffering  	= document.getElementById('buffering');

var controls = {
	backBtn: 	document.getElementById('backBtn'),
	playBtn: 	document.getElementById('playBtn'),
	pauseBtn: 	document.getElementById('pauseBtn'),
	stopBtn: 	document.getElementById('stopBtn'),
	playBtn: 	document.getElementById('playBtn'),
	forwardBtn: document.getElementById('forwardBtn')
}

controls.playBtn.addEventListener('click', function() { context.resume(); } );
controls.pauseBtn.addEventListener('click', function() { context.suspend(); } );

var context 	= new AudioContext();
var gainNode 	= context.createGain();
var playing		= true;

window.addEventListener('dragover', 	dragOverHandle, 	false);
window.addEventListener('drop', 		dropHandle, 		false);
window.addEventListener('dragleave',	dragLeaveHandle,	false);
window.addEventListener('drop', 		fileHandle, 		false);