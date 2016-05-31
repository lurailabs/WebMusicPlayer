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
            if (!animation) {
                animation = new Animation();
                animation.start();
            }
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
        if (index < 0 || index > songs.length-1) {
            currentSongIndex = null;
        } else {
            currentSongIndex = index;
            changeSongBgcolor(index);
        }
    };

    var removeSong = function(index) {
        if (index === currentSongIndex) {
            var newSong = (currentSongIndex < songs.length-1) ? goForward() : goBack();
            if (newSong) {
                $audio.src = newSong.getBlobUrl();
                $audio.play();
            }
        }
        songs.splice(index, 1);
        redrawWidget();
        if (index <= currentSongIndex) setCurrentSongIndex(currentSongIndex-1);
        if (currentSongIndex !== null) {
            changeSongBgcolor(currentSongIndex);
        } else {
            $audio.pause();
            $audio.src = null;
            $audio.removeAttribute('src');
        }
    };

    
    
    /**   PLAYLIST WIDGET   **/
    
    var addToPlaylistWidget = function(song) {
        $playlist.innerHTML += song.getSnippet();
    };

    var changeSongBgcolor = function(index) {
        var $currentSong  = $playlist.getElementsByClassName('song')[index];
        var $previousSong = $playlist.getElementsByClassName('playing')[0];
        if($previousSong) $previousSong.classList.remove('playing');
        $currentSong.classList.add('playing');
    };

    var redrawWidget = function() {
        $playlist.innerHTML = '';
        for (var i=0; i<songs.length; i++) {
            $playlist.innerHTML += songs[i].getSnippet();
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
            if (e.target.classList.contains('remove-song')) {
                removeSong(index);
            } else {
                setCurrentSongIndex(index);
                $audio.src = songs[currentSongIndex].getBlobUrl();
                $audio.play();
            }
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
