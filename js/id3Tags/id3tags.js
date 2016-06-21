function id3tags(song, done) {

    var id3tags = {};

    var getDataView = function() {
        var reader = new FileReader();
        reader.addEventListener('load', function(event) {
            var buffer = event.target.result;

            getID3v1Tags(new DataView(buffer, buffer.byteLength - 128, 128), function(tags) {
                id3tags.v1 = tags;
                done(id3tags);
            });

            getID3v2Tags(new DataView(buffer, 0, 10), function(tags) {
                id3tags.v2 = tags;
                done(id3tags);
            });
        });
        reader.readAsArrayBuffer(song.file);
    };

    getDataView();
}