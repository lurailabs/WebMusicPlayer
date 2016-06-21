function getID3v1Tags(dataView, done) {
    
    var id3v1 = null;
    
    var hasId3v1Tags = function() {
        var tag = decodeField(0, 3);
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

    var readTags = function() {
        
        if (hasId3v1Tags()) {
            id3v1 = {};
            id3v1.title     = decodeField(3, 33);
            id3v1.artist    = decodeField(33, 63);
            id3v1.album     = decodeField(63, 93);
            id3v1.year      = decodeField(93, 97);
            id3v1.comment   = decodeField(97, 127);
            id3v1.genre     = dataView.getUint8(127);
        }
        
        done(id3v1);
    };
    
    readTags();

}
