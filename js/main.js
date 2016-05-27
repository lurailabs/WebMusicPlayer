/**
 *	Drag events
 **/

function fileHandle(event) {

    var files 	= event.dataTransfer.files;
    var file 	= null;

    for (var i=0; i<files.length; i++) {
        file = files[i];
        console.log('Name: ' + file.name);

        if (file.type !== 'audio/mp3') console.log('Not mp3');
        else {
            var song = new Song(file);
            playlist.addSong(song);
            var currentSong = playlist.getCurrentSong();
            if (currentSong) {
                $audio.src = currentSong.getBlobUrl();
                $audio.oncanplay = function() { $audio.play(); };
            }
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


var playlist        = new Playlist();

var $dropHere 	    = document.getElementById('dropHereMsg');
var $audio          = document.getElementById('audio');




