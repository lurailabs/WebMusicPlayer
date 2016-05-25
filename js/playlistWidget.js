
var PlaylistWidget = function() {
 
    var $playlist 	    = document.getElementById('playlist');
    var songs = [];


    var togglePlaylist = function() {
        $playlist.classList.contains('hidden') ?
            $playlist.classList.remove('hidden') :
            $playlist.classList.add('hidden');
    };

    var addSong = function(song) {
        var newSong =  '<div class="song">' +
            '<p class="title">'  + song.getName()  + '</p>' +
            '<p class="artist">' + '---' + '</p>' +
            '</div>';
        $playlist.innerHTML += newSong;
        songs.push(song.name);
    };


    return {
        togglePlaylist: togglePlaylist,
        addSong: addSong
    }
};
