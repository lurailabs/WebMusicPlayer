
var PlaylistWidget = function() {
 
    var $playlist 	    = document.getElementById('playlist');

    /*
     Toggles playlist widget
     */
    // var $playlistTitle  = document.querySelector('#playlist h1');
    // $playlistTitle.addEventListener('click', function(){ playlistWidget.togglePlaylist(); } );

    var togglePlaylist = function() {
        $playlist.classList.contains('hidden') ?
            $playlist.classList.remove('hidden') :
            $playlist.classList.add('hidden');
    };

    var addSong = function(song) {
        var newSong =  '<div class="song">' +
            '<p class="title">'  + song.name  + '</p>' +
            '<p class="artist">' + '---' + '</p>' +
            '</div>';
        $playlist.innerHTML += newSong;
    };

    return {
        togglePlaylist: togglePlaylist,
        addSong: addSong
    }
};
