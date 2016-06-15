function getID3v2Tags(song) {

    var dataView        = null;
    var titleTag        = 'TIT2';
    var albumTag        = 'TALB';
    var performerTag    = 'TPE1';
    var bandTag         = 'TPE2';
    var pictureTag      = 'APIC';

    var getDataView = function() {
        var reader = new FileReader();
        reader.addEventListener('load', function(event) {
            var buffer = event.target.result;
            dataView = new DataView(buffer, 0, buffer.byteLength);
            if ( hasId3v2Tags() ) {
                //recorrer(dataView);
                console.log('dataView size: ' + dataView.byteLength);
                readHeader(new DataView(buffer, 0, 10) );
            }
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


    var readHeader = function(dv) {

        var id3 = '', version = '', flags = '', size = 0;
        var i;

        for (i = 0; i < 3; i++) {
            id3 += String.fromCharCode(dataView.getUint8(i));
        }
        console.log('ID3: ' + id3);

        version = dataView.getUint8(3) + '.' + dataView.getUint8(4);
        console.log('VERSION: ' + version);

        flags = dataView.getUint8(5).toString(2);
        console.log('FLAGS: ' + flags);

        size = (dataView.getUint8(6) << 21) | (dataView.getUint8(7) << 14) |
            (dataView.getUint8(8) << 7) | (dataView.getUint8(9));
        console.log('SIZE: ' + size);

        var startingByte = 10;
        var frameSize = 0;
        while (startingByte < size + 10) {
            getFrameId(startingByte);
            frameSize = getSize(startingByte + 4);
            startingByte += frameSize + 10;
        }
    };

    var getFrameId = function(firstByte) {
        var frameId = '';
        for (var i = firstByte; i < firstByte + 4; i++) {
            frameId += String.fromCharCode(dataView.getUint8(i));
        }
        console.log('Frame id: ' + frameId);
    };

    var getSize = function(firstByte) {

        var size = (dataView.getUint8(firstByte) << 21) | (dataView.getUint8(firstByte + 1) << 14) |
            (dataView.getUint8(firstByte + 2) << 7) | dataView.getUint8(firstByte + 3);

        console.log('FRAME SIZE: ' + size);
        return size;
    };





    function recorrer(dv) {
        console.log('Version: ' + dv.getUint8(3) + ' ' + dv.getUint8(4) );
        console.log('Flags: ' + dv.getUint8(5).toString(2) );
        var size = 4 * (dv.getUint8(6) + dv.getUint8(7) +
            dv.getUint8(8) + dv.getUint8(9));
        console.log('Size: ' + size);

        for (var i = 10; i < 300; i++) {
            console.log( 'Byte ' + i + ': ' + String.fromCharCode(dv.getUint8(i)) );
        }
    }
    

    getDataView();
}