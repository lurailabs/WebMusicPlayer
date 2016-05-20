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

    var addSong = function(song) {
        songs.push(song);
        size++;
    };

    var removeSong = function(song) {
        var songIndex = getIndex(song);
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

    var getIndex = function(song) {

    };
    
    return {
        addSong: addSong,
        getSize: getSize
    }
};
