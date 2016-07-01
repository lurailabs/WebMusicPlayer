"use strict";

var playlist  = playlist();
var animation = animation();

var $audio      = document.getElementById('audio');

/**
 *    FILE DRAG & DROP EVENTS
 **/

function fileHandle(event) {

    var files = event.dataTransfer.files;
    var file = null;

    for (var i = 0; i < files.length; i++) {
        file = files[i];
        console.log('Name: ' + file.name + '\nType: ' + file.type);

        if (file.type.indexOf('audio') < 0) console.log('Not music');
        else playlist.addSong(new Song(file));
    }
}

function defaultBehaviour(event) {
    event.stopPropagation();
    event.preventDefault();
}

function dragOverHandle(event) {
    defaultBehaviour(event);
    event.dataTransfer.dropEffect = 'copy';
}

function dropHandle(event) {
    defaultBehaviour(event);
    fileHandle(event);
}

window.addEventListener('dragstart',    defaultBehaviour, false);
window.addEventListener('drag',         defaultBehaviour, false);
window.addEventListener('dragenter',    defaultBehaviour, false);
window.addEventListener('dragleave',    defaultBehaviour, false);
window.addEventListener('dragend',      defaultBehaviour, false);
window.addEventListener('dragover',     dragOverHandle, false);
window.addEventListener('drop',         dropHandle, false);


/**
 *    AUDIO TAG EVENTS
 **/

$audio.onended = function () {
    var song = playlist.goForward();
    if (song instanceof Song) {
        $audio.src = song.blobUrl;
        $audio.play();
    }
};

$audio.onplay = function () {
    controls.playBtn.classList.add('hidden');
    controls.pauseBtn.classList.remove('hidden');
};

$audio.ontimeupdate = function () {
    controls.positionSlider.value = ($audio.currentTime * controls.positionSlider.max) / $audio.duration;
};


