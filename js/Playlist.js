var Playlist = function() {
    var songs = [];
    var currentSong = null;
    var size = songs.length;

    var getSize = function() {
        return size;
    };

    var getCurrentSong = function() {
        return currentSong;
    };

    var setCurrentSong = function(song) {
        currentSong = song;
    };
    
    var getPreviousSong = function() {
        if (currentSong === songs[0]) return;
        var currentIndex = getIndex(currentSong);
        currentSong = songs[currentIndex-1];
        return songs[currentIndex-1];
    };
    
    var getNextSong = function() {
        if (currentSong === songs[songs.length-1]) return;
        var currentIndex = getIndex(currentSong);
        currentSong = songs[currentIndex+1];
        return songs[currentIndex+1];
    };

    var addSong = function(song) {
        songs.push(song);
        size++;
        if (size === 1) currentSong = song;
    };

    var getIndex = function(song) {
        for (var i = 0; i < songs.length; i++) {
            if (songs[i] === song) return i;
        }
    };

    /*
     var removeSong = function(song) {
         var songIndex = getIndex(song);
         if (currentSong === song) {
         currentSong = (songIndex + 1) < size ? songs[songIndex+1] : null;
         }
         songs.splice(songIndex, 1);
         size--;
     };
     
     var moveSongUp = function(song) {
         var songIndex = getIndex(song);
         if (songIndex === 0) return;
         songs.splice(songIndex-1, 0, song);
     };

     var moveSongDown = function(song) {
         var songIndex = getIndex(song);
         if (songIndex === size-1) return;
         songs.splice(songIndex+1, 0, song);

     };
     */
    
    return {
        addSong:            addSong,
        getSize:            getSize,
        getPreviousSong:    getPreviousSong,
        getNextSong:        getNextSong,
        setCurrentSong:     setCurrentSong,
        getCurrentSong:     getCurrentSong
    }
};
