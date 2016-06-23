var Playlist = function() {

    var songs               = [];
    var currentSongIndex    = null;
    var $playlist 	        = document.getElementById('playlist');

    var addSong = function(song) {
        document.querySelector('#dropHereMsg').classList.add('hidden');
        songs.push(song);
        addToPlaylistWidget(song);
        if (songs.length === 1) {
            setCurrentSongIndex(0);
            $audio.src = song.blobUrl;
            $audio.play();
            if (!animation) {
                animation = Animation();
                animation.start();
            }
        }
        song.getId3tags();
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
            songs[currentSongIndex].showInfo();
        }
    };

    var removeSong = function(index) {
        songs.splice(index, 1);

        if (index < currentSongIndex) {
            setCurrentSongIndex(currentSongIndex-1);

        } else if (index === currentSongIndex) {
            var newSong = (currentSongIndex < songs.length-1) ? goForward() : goBack();
            if (newSong) {
                $audio.src = newSong.blobUrl;
                $audio.play();
            } else {
                $audio.pause();
                $audio.src = null;
                $audio.removeAttribute('src');
            }
        }
        
        redrawWidget();
    };

    
    
    /**   PLAYLIST WIDGET   **/
    
    var addToPlaylistWidget = function(song) {
        $playlist.innerHTML += song.getSnippet();
    };

    var changeSongBgcolor = function(index) {
        var $currentSong  = $playlist.getElementsByClassName('song')[index];
        var $previousSong = $playlist.getElementsByClassName('playing')[0];
        if ($previousSong) $previousSong.classList.remove('playing');
        if ($currentSong) $currentSong.classList.add('playing');
    };

    var redrawWidget = function() {
        $playlist.innerHTML = '';
        for (var i=0; i<songs.length; i++) {
            $playlist.innerHTML += songs[i].getSnippet();
        }
        changeSongBgcolor(currentSongIndex);
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
                $audio.src = songs[currentSongIndex].blobUrl;
                $audio.play();
            }
        }
    });
    
    /* ID3 tags decoder is async. Tis function is called when tags are ready  */
    var tagsReady = function() {
        redrawWidget();
        songs[currentSongIndex].showInfo();
    };

    

    return {
        addSong:        addSong,
        getCurrentSong: getCurrentSong,
        goBack:         goBack,
        goForward:      goForward,
        togglePlaylist: togglePlaylist,
        tagsReady:      tagsReady
    };
};
