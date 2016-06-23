var playlist  = Playlist();
var animation = null;

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

function preventDefault(event) {
    event.stopPropagation();
    event.preventDefault();
}

function dragOverHandle(event) {
    preventDefault(event);
    event.dataTransfer.dropEffect = 'copy';
}

function dropHandle(event) {
    preventDefault(event);
    fileHandle(event);
}

window.addEventListener('dragstart',    preventDefault, false);
window.addEventListener('drag',         preventDefault, false);
window.addEventListener('dragenter',    preventDefault, false);
window.addEventListener('dragleave',    preventDefault, false);
window.addEventListener('dragend',      preventDefault, false);
window.addEventListener('dragover',     dragOverHandle, false);
window.addEventListener('drop',         dropHandle, false);


/**
 *    AUDIO TAG EVENTS
 **/

$audio.onended = function () {
    var song = playlist.goForward();
    if (song) {
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

