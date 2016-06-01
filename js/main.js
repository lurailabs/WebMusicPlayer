var playlist        = new Playlist();
var animation       = null;

var $dropHere 	    = document.getElementById('dropHereMsg');
var $audio          = document.getElementById('audio');

/**
 *	FILE DRAG & DROP EVENTS
 **/

function fileHandle(event) {

    var files 	= event.dataTransfer.files;
    var file 	= null;

    for (var i=0; i<files.length; i++) {
        file = files[i];
        console.log('Name: ' + file.name);
        console.log('Type: ' + file.type);

        if (file.type.indexOf('audio') < 0) console.log('Not music');
        else {
            var song = new Song(file);
            playlist.addSong(song);
        }
    }
}

function dragOverHandle(event) {
    event.stopPropagation();
    event.preventDefault();
    $dropHere.className = '';
    event.dataTransfer.dropEffect = 'copy';
}


function dragLeaveHandle(event) {
    event.stopPropagation();
    event.preventDefault();
    $dropHere.className += 'hidden';
}

function dropHandle(event) {
    event.stopPropagation();
    event.preventDefault();
    $dropHere.className += 'hidden';
    fileHandle(event);
}


window.addEventListener('dragover', 	dragOverHandle, 	false);
window.addEventListener('dragleave',	dragLeaveHandle,	false);
window.addEventListener('drop', 		dropHandle, 		false);


/**
 *	AUDIO TAG EVENTS
 **/

$audio.onended = function() {
    var song = playlist.goForward();
    if (song) {
        $audio.src = song.getBlobUrl();
        $audio.play();
    }
};

$audio.onplay = function() {
    controls.playBtn.classList.add('hidden');
    controls.pauseBtn.classList.remove('hidden');
};

$audio.ontimeupdate = function() {
      controls.positionSlider.value = ($audio.currentTime * controls.positionSlider.max) / $audio.duration;
};


