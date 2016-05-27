var Playlist = function() {

    var songs               = [];
    var currentSongIndex    = null;
    var $playlist 	        = document.getElementById('playlist');

    var addSong = function(song) {
        songs.push(song);
        addToPlaylistWidget(song);
        if (songs.length === 1) currentSongIndex = 0;
    };
    
    var getCurrentSong = function() {
      if (currentSongIndex !== null) return songs[currentSongIndex];  
    };

    var goBack = function() {
        if (currentSongIndex === 0) return;
        currentSongIndex -= 1;
        return songs[currentSongIndex];
    };

    var goForward = function() {
        if (currentSongIndex === songs.length-1) return;
        currentSongIndex += 1;
        return songs[currentSongIndex];
    };
    
    
    
    /**   PLAYLIST WIDGET   **/
    
    var addToPlaylistWidget = function(song) {
        $playlist.innerHTML +=
            '<div class="song">' +
            '<p class="title">'  + song.getFileName()  + '</p>' +
            '<p class="artist">' + '---' + '</p>' +
            '</div>';
    };

    var redrawPlaylistWidget = function() {
        $playlist.innerHTML = '';
        for (var i=0, j=songs.length; i<j; i++) {
            $playlist.innerHTML += 
                '<div class="song">' +
                    '<p class="title">'  + songs[i].getFileName()  + '</p>' +
                    '<p class="artist">' + '---' + '</p>' +
                '</div>';
        }
    };

    var togglePlaylist = function() {
        $playlist.classList.contains('hidden') ?
            $playlist.classList.remove('hidden') :
            $playlist.classList.add('hidden');
    };




    return {
        addSong:        addSong,
        getCurrentSong: getCurrentSong,
        goBack:         goBack,
        goForward:      goForward,
        togglePlaylist: togglePlaylist
    }
};
