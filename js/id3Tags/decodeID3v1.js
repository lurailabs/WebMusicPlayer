function getID3v1Tags(song, done) {

    var dataView = null;
    var id3v1 = {};

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
        var tag = decodeField(0, 3);
        console.log('Has ID3 Tags v.1? ' + (tag === 'TAG'));
        return tag === 'TAG';
    };

    // dv: dataView, start: first byte, end: last byte
    var decodeField = function(start, end) {
        var str = '';
        for (var i = start; i < end; i++) {
            str += String.fromCharCode(dataView.getUint8(i));
        }
        return str;
    };

    var readInfo = function() {
        
        if (hasId3v1Tags()) {
            id3v1.title     = decodeField(3, 33);
            id3v1.artist    = decodeField(33, 63);
            id3v1.album     = decodeField(63, 93);
            id3v1.year      = decodeField(93, 97);
            id3v1.comment   = decodeField(97, 127);
            id3v1.genre     = dataView.getUint8(127);
        }

        // As this is async, playlist has to be alerted when tags are ready, so it can redraw itself
        //playlist.tagsReady();

        done(id3v1);
    };
    
    getDataView();

}
