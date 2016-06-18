function getID3v2Tags(song) {

    var id3v2      = {
        header: {}
    };

    /*
    var titleTag        = 'TIT2';
    var albumTag        = 'TALB';
    var performerTag    = 'TPE1';
    var bandTag         = 'TPE2';
    var pictureTag      = 'APIC';
    */

    var getDataView = function() {
        var reader = new FileReader();
        reader.addEventListener('load', function(event) {
            var buffer = event.target.result;
            readHeader( new DataView(buffer, 0, 10) );
            if (id3v2.header.id3 === 'ID3') {
                readBody( new DataView(buffer, 10, id3v2.header.size));
            }
        });
        reader.readAsArrayBuffer(song.file);
    };

    var hasId3v2Tags = function() {
        var id3 = '';
        for (var i = 0; i < 3; i++) {
            id3 += String.fromCharCode(dataView.getUint8(i));
        }
        return id3 === 'ID3';
    };


    var readHeader = function(dv) {

        id3v2.header = {
            'id3': String.fromCharCode(dv.getUint8(0), dv.getUint8(1), dv.getUint8(2)),
            'version': [dv.getUint8(3), dv.getUint8(4)],
            'flags': (function () {
                var str = '0000000' + dv.getUint8(5).toString(2);
                return str.substring(str.length - 8);
            })(),
            'size': getSize(dv, 6)
        };
    };

    var readBody = function(dv) {

        var position = 0, frameId = '', frameSize = 0, data = '';

        do {
            frameId = getFrameId(dv, position);
            // if not valid frame Id
            if (!/^[A-Z]{3}([A-Z]|[1-4])$/.test(frameId)) break;

            frameSize = getSize(dv, position + 4);

            if (frameId[0] === 'T' && frameId !== 'TXXX') {
                data = getTextFrameData(new DataView(dv.buffer, position + 20, frameSize));

            } else if (frameId === 'APIC') {
                data = getPicFrameData (new DataView(dv.buffer, position + 20, frameSize));
            }
            position += 10 + frameSize;
            id3v2[frameId] = data;
        } while(position < dv.byteLength);

        console.log(id3v2);
    };



    var getFrameId = function(dv, position) {

        var frameId = '';
        for (var i = position; i < position + 4; i++) {
            frameId += String.fromCharCode(dv.getUint8(i));
        }
        return frameId;
    };



    var getSize = function(dv, position) {

        return (dv.getUint8(position) << 21) | (dv.getUint8(position + 1) << 14) |
            (dv.getUint8(position + 2) << 7) | dv.getUint8(position + 3);
    };


    var getTextFrameData = function(dv) {

        var encoding    = getTextEncoding(dv.getUint8(0));
        var text        = '';
        var bom1        = dv.getUint8(1);
        var bom2         = dv.getUint8(2);
        var i = (bom1 === 255 && bom2 === 254) || (bom1 === 254 && bom1 === 255) ? 3 : 1;

        for (i; i < dv.byteLength; i++ ) {
            text += String.fromCharCode( dv.getUint8(i) );
        }

        return {
            encoding: encoding,
            data: text
        };
    };


    var getPicFrameData = function(dv) {

        var pictureTypes = [
            'Other',
            '32x32 pixels "file icon" (PNG only)',
            'Other file icon',
            'Cover (front)',
            'Cover (back)',
            'Leaflet page',
            'Media (e.g. label side of CD)',
            'Lead artist/lead performer/soloist',
            'Artist/performer',
            'Conductor',
            'Band/Orchestra',
            'Composer',
            'Lyricist/text writer',
            'Recording Location',
            'During recording',
            'During performance',
            'Movie/video screen capture',
            'A bright coloured fish',
            'Illustration',
            'Band/artist logotype',
            'Publisher/Studio logotype'
        ];
        var mimeType    = '', description = '', data = '';
        var encoding    = getTextEncoding(dv.getUint8(0));
        var position = 1;
        while (dv.getUint8(position) !== 0x00) {
            mimeType += String.fromCharCode( dv.getUint8(position) );
            position++;
        }
        position += 1;  // $00 after MIME type
        var picType = pictureTypes[dv.getUint8(position)];
        position += 1;
        while (dv.getUint8(position) !== 0x00) {
            description += String.fromCharCode( dv.getUint8(position) );
            position++;
        }
        position += 1;  // $00 after description

        while(position < dv.byteLength) {
            data += String.fromCharCode( dv.getUint8(position) & 0xFF);
            position++;
        }

        var base64 = 'data:' + mimeType + ';base64,' + window.btoa(data);

        document.getElementById('cover-image').setAttribute('src', base64);

        return {
            encoding: encoding,
            mimeType: mimeType,
            pictureType: picType,
            description: description,
            base64_data: base64
        };
    };


    function getTextEncoding(code) {
        var charset;
        switch(code) {
            case 0x00:
                charset = 'iso-8859-1';
                break;

            case 0x01:
                charset = 'utf-16';
                break;

            case 0x02:
                charset = 'utf-16be';
                break;

            case 0x03:
                charset = 'utf-8';
                break;
        }

        return charset;
    }


    getDataView();
}