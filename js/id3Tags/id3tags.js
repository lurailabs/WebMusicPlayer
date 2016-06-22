function id3tags(song, done) {

    var id3tags = {};

    var readV1 = function() {
        var reader  = new FileReader();
        var first128 = song.file.slice(song.file.size - 128, song.file.size);
        reader.addEventListener('load', function(event) {


            var buffer = event.target.result;

            getID3v1Tags(new DataView(buffer), function(tags) {
                id3tags.v1 = tags;
                done(id3tags, 'readV1');
            });
        });
        reader.readAsArrayBuffer(first128);
    };

    var checkV2 = function() {
        console.log('en checkV2');
        var reader  = new FileReader();
        var first3 = song.file.slice(0, 3);
        reader.addEventListener('load', function(event) {
            var str = event.target.result;
            if (str === 'ID3') {
                reader = null;
                getID3v2Tags(song.file, function(tags) {
                    id3tags.v2 = tags;
                    done(id3tags, 'checkV2');
                });
            } else {
                id3tags.v2 = null;
                done(id3tags, 'checkV2, id3tags.v2 = null');
            }

        });
        reader.readAsText(first3);
    };


    readV1();
    checkV2();
}