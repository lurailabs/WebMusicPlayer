function getID3v2Tags(song) {

    var dataView = null;

    var getDataView = function() {
        var reader = new FileReader();
        reader.addEventListener('load', function(event) {
            var buffer = event.target.result;
            dataView = new DataView(buffer, 0, 3);
            hasId3v2Tags();
            //readInfo();
        });
        reader.readAsArrayBuffer(song.file);
    };

    var hasId3v2Tags = function() {
        var id3 = '';
        for (var i = 0; i < 3; i++) {
            id3 += String.fromCharCode(dataView.getUint8(i));
        }
        console.log('Has ID3 Tags v.2? ' + (id3 === 'ID3'));
        return id3 === 'ID3';
    };

    getDataView();
}