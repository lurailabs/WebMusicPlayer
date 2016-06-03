function getID3v1Tags(song) {

    var dataView = null;

    var getDataView = function() {
        var reader = new FileReader();
        reader.addEventListener('load', function(event) {
            var buffer = event.target.result;
            dataView = new DataView(buffer, buffer.byteLength - 128, 128);
            readInfo();
        });
        reader.readAsArrayBuffer(song.file);
    };
    
    var hasId3v1Tags = function() {
        var tag = '';
        for (var i = 0; i < 3; i++) {
            tag += String.fromCharCode(dataView.getUint8(i));
        }
        return tag === 'TAG';
    };

    // dv: dataView, start: first byte, end: last byte
    var decodeField = function(start, end) {
        var str = '';
        for (var i = start; i < end + 1; i++) {
            str += String.fromCharCode(dataView.getUint8(i));
        }
        return str;
    };

    var readInfo = function() {
        if (!hasId3v1Tags()) return;
        song.title  =  decodeField(3, 30);
        song.artist = decodeField(31, 60);
        song.album  =  decodeField(61, 90);

        // var year  =   decodeField(dv, 91, 94);
        // var track =  decodeField(dv, 126, 126);
        // var genre =  decodeField(dv, 127, 127);
        // console.log('Title: ' + song.title + '\nArtist: ' + song.artist + '\nAlbum: ' + song.album);

        // As this is async, playlist has to be alerted when tags are ready, so it can redraw itself
        playlist.tagsReady();
    };
    
    return getDataView();
}
