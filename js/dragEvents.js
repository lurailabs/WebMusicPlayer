/**
 *	Drag events
 **/

function fileHandle(event) {

    event.stopPropagation();
    event.preventDefault();

    var files 	= event.dataTransfer.files;
    var file 	= null;

    for (var i=0; i<files.length; i++) {
        file = files[i];
        console.log('Name: ' + file.name);
        //console.log('Type: ' + file.type);
        //console.log('Size: ' + file.size);
        //console.log('Last modified: ' + file.lastModifiedDate);

        if (file.type !== 'audio/mp3') console.log('Not mp3');
        else {
            var song = new Song(file);
            playlist.addSong(song);
            playlistWidget.addSong(song);
            if (playlist.getSize() === 1) processSong(song);

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
}

var $dropHere 	    = document.getElementById('dropHereMsg');
var $buffering  	= document.getElementById('buffering');

window.addEventListener('dragover', 	dragOverHandle, 	false);
window.addEventListener('drop', 		dropHandle, 		false);
window.addEventListener('dragleave',	dragLeaveHandle,	false);
window.addEventListener('drop', 		fileHandle, 		false);