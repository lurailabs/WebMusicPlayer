var Playlist = function() {

    var songs               = [];
    var currentSongIndex    = null;
    var $playlist 	        = document.getElementById('playlist');

    var addSong = function(song) {
        songs.push(song);
        addToPlaylistWidget(song);
        if (songs.length === 1) {
            setCurrentSongIndex(0);
            $audio.src = song.getBlobUrl();
            $audio.play();
        }
    };
    
    var getCurrentSong = function() {
      if (currentSongIndex !== null) return songs[currentSongIndex];  
    };

    var goBack = function() {
        if (currentSongIndex === 0) return;
        setCurrentSongIndex(currentSongIndex - 1);
        return songs[currentSongIndex];
    };

    var goForward = function() {
        if (currentSongIndex === songs.length-1) return;
        setCurrentSongIndex(currentSongIndex + 1);
        return songs[currentSongIndex];
    };

    var setCurrentSongIndex = function(index) {
        currentSongIndex = index;
        changeSongBgcolor(index);
    };
    
    
    /**   PLAYLIST WIDGET   **/
    
    var addToPlaylistWidget = function(song) {
        $playlist.innerHTML +=
            '<div class="song">' +
            '<p class="title">'  + song.getFileName()  + '</p>' +
            '<p class="artist">' + '---' + '</p>' +
            '</div>';
    };

    var changeSongBgcolor = function(index) {
        var $currentSong  = $playlist.getElementsByClassName('song')[index];
        var $previousSong = $playlist.getElementsByClassName('playing')[0];
        if($previousSong) $previousSong.classList.remove('playing');
        $currentSong.classList.add('playing');
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

    $playlist.addEventListener('click', function(e) {
        var $song = e.target.closest('.song');  // closest is experimental. Not working on IE
        if ($song) {
            var index = Array.prototype.indexOf.call($playlist.children, $song);
            setCurrentSongIndex(index - 1);
            $audio.src = songs[currentSongIndex].getBlobUrl();
            $audio.play();
        }
    });


    return {
        addSong:        addSong,
        getCurrentSong: getCurrentSong,
        goBack:         goBack,
        goForward:      goForward,
        togglePlaylist: togglePlaylist
    };
};
