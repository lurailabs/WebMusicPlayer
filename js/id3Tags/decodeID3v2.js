function getID3v2Tags(song) {

    var id3v2      = {
        header: {}
    };

    var frameIds = [
        'BUF',
        'CNT',
        'COM',
        'CRA',
        'CRM',
        'ETC',
        'EQU',
        'GEO',
        'IPL',
        'LNK',
        'MCI',
        'MLL',
        'PIC',
        'POP',
        'REV',
        'RVA',
        'SLT',
        'STC',
        'TAL',
        'TBP',
        'TCM',
        'TCO',
        'TCR',
        'TDA',
        'TDY',
        'TEN',
        'TFT',
        'TIM',
        'TKE',
        'TLA',
        'TLE',
        'TMT',
        'TOA',
        'TOF',
        'TOL',
        'TOR',
        'TOT',
        'TP1',
        'TP2',
        'TP3',
        'TP4',
        'TPA',
        'TPB',
        'TRC',
        'TRD',
        'TRK',
        'TSI',
        'TSS',
        'TT1',
        'TT2',
        'TT3',
        'TXT',
        'TXX',
        'TYE',
        'UFI',
        'ULT',
        'WAF',
        'WAR',
        'WAS',
        'WCM',
        'WCP',
        'WPB',
        'WXX',
        'AENC',
        'APIC',
        'ASPI',
        'COMM',
        'COMR',
        'ENCR',
        'EQU2',
        'EQUA',
        'ETCO',
        'GEOB',
        'GRID',
        'IPLS',
        'LINK',
        'MCDI',
        'MLLT',
        'OWNE',
        'PRIV',
        'PCNT',
        'POPM',
        'POSS',
        'RBUF',
        'RVA2',
        'RVAD',
        'RVRB',
        'SEEK',
        'SYLT',
        'SYTC',
        'TALB',
        'TBPM',
        'TCOM',
        'TCON',
        'TCOP',
        'TDAT',
        'TDLY',
        'TDRC',
        'TDRL',
        'TDTG',
        'TENC',
        'TEXT',
        'TFLT',
        'TIME',
        'TIPL',
        'TIT1',
        'TIT2',
        'TIT3',
        'TKEY',
        'TLAN',
        'TLEN',
        'TMCL',
        'TMED',
        'TMOO',
        'TOAL',
        'TOFN',
        'TOLY',
        'TOPE',
        'TORY',
        'TOWN',
        'TPE1',
        'TPE2',
        'TPE3',
        'TPE4',
        'TPOS',
        'TPRO',
        'TPUB',
        'TRCK',
        'TRDA',
        'TRSN',
        'TRSO',
        'TSOA',
        'TSOP',
        'TSOT',
        'TSIZ',
        'TSRC',
        'TSSE',
        'TSST',
        'TYER',
        'TXXX',
        'UFID',
        'USER',
        'USLT',
        'WCOM',
        'WCOP',
        'WOAF',
        'WOAR',
        'WOAS',
        'WORS',
        'WPAY',
        'WPUB',
        'WXXX' ];

    window.onerror = function(message, file, line, col, error) {
        console.log('Error ocurred: ' + error.message);
        console.log(id3v2);
        return false;
    };


    var getDataView = function() {
        var reader = new FileReader();
        reader.addEventListener('load', function(event) {
            var buffer = event.target.result;
            readHeader( new DataView(buffer, 0, 10) );
            if (id3v2.header.id3 === 'ID3') {
                readBody( new DataView(buffer, 10, id3v2.header.bodySize) );
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
            'id3':      String.fromCharCode(dv.getUint8(0), dv.getUint8(1), dv.getUint8(2)),
            'version':  [dv.getUint8(3), dv.getUint8(4)],
            'flags':    Decoder.getBitsFromByte(dv.getUint8(5)),
            'bodySize':     getSize(dv, 6)
        };
    };

    var readBody = function(dv) {

        var position = 0, frameId = '', frameSize = 0, frameFlags = [], data = '', num = 0;

        do {
            frameId = getFrameId(dv, position);

            if (frameIds.indexOf(frameId) === -1) {
                position++;
                if (position >= dv.byteLength - 10) {
                    console.log('out of tags bounds');
                    break;
                }
                else continue;
            }

            frameSize = getSize(dv, position + 4);

            frameFlags = [
                Decoder.getBitsFromByte(dv.getUint8(position + 8)),
                Decoder.getBitsFromByte(dv.getUint8(position + 9))
            ];

            console.log('Frame ID: ' + frameId + ' - Frame size: ' + frameSize);

            if (frameId === 'APIC') {
                // TO-DO: find out why APIC frameSize is not correct. I'm manually adding lots of bytes
                // to get the whole image
                data = getPicFrameData (new DataView(dv.buffer, position + 20, frameSize + 30000), position + 20);
            } else {
                data = getTextFrameData(new DataView(dv.buffer, position + 20, frameSize));
            }

            position += 10 + frameSize;

            if (id3v2.hasOwnProperty(frameId)) {
                frameId += '-' + num;
                num++;
            }
            id3v2[frameId] = data;
            id3v2[frameId].size = frameSize;
            id3v2[frameId].flags = frameFlags;

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
        var codes       = [];

        for (var i = 1; i < dv.byteLength; i++ ) {
            codes.push(dv.getUint8(i).toString(16));
        }

        return {
            encoding:   encoding,
            codes:      codes,
            data:       Decoder[encoding](dv)
        };
    };


    var getPicFrameData = function(dv, bufferPosition) {

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
            data += String.fromCharCode( dv.getUint8(position) );
            position++;
        }

        var base64 = 'data:' + mimeType + ';base64,' + window.btoa(data);

        tryImage(base64);


        return {
            encoding:       encoding,
            mimeType:       mimeType,
            pictureType:    picType,
            description:    description,
            base64_data:    base64
        };
    };

    // Converts an ArrayBuffer directly to base64, without any intermediate 'convert to string then
// use window.btoa' step. According to my tests, this appears to be a faster approach:
// http://jsperf.com/encoding-xhr-image-data/5

    function base64ArrayBuffer(bytes) {
        var base64    = '';
        var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

        //var bytes         = new Uint8Array(arrayBuffer)
        var byteLength    = bytes.byteLength;
        var byteRemainder = byteLength % 3;
        var mainLength    = byteLength - byteRemainder;

        var a, b, c, d;
        var chunk;

        // Main loop deals with bytes in chunks of 3
        for (var i = 0; i < mainLength; i = i + 3) {
            // Combine the three bytes into a single integer
            chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

            // Use bitmasks to extract 6-bit segments from the triplet
            a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
            b = (chunk & 258048)   >> 12; // 258048   = (2^6 - 1) << 12
            c = (chunk & 4032)     >>  6; // 4032     = (2^6 - 1) << 6
            d = chunk & 63;               // 63       = 2^6 - 1

            // Convert the raw binary segments to the appropriate ASCII encoding
            base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
        }

        // Deal with the remaining bytes and padding
        if (byteRemainder == 1) {
            chunk = bytes[mainLength];

            a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2

            // Set the 4 least significant bits to zero
            b = (chunk & 3)   << 4; // 3   = 2^2 - 1

            base64 += encodings[a] + encodings[b] + '==';
        } else if (byteRemainder == 2) {
            chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];

            a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
            b = (chunk & 1008)  >>  4; // 1008  = (2^6 - 1) << 4

            // Set the 2 least significant bits to zero
            c = (chunk & 15)    <<  2; // 15    = 2^4 - 1

            base64 += encodings[a] + encodings[b] + encodings[c] + '=';
        }

        return base64;
    }


    function tryImage(base64) {

        document.querySelector('canvas').setAttribute('hidden', 'true');
        var img = document.createElement('img');
        img.src = base64;
        document.body.appendChild(img);
    }


    function getTextEncoding(code) {
        var charset;
        switch(code) {
            case 0x00:
                charset = 'iso-8859-1';
                break;

            case 0x01:
                charset = 'utf-16';  // big or little endian (if BOM not present: big endian)
                break;

            case 0x02:
                charset = 'utf-16be'; // big endian
                break;

            case 0x03:
                charset = 'utf-8';
                break;

            default:
                charset = 'other';
        }

        return charset;
    }


    getDataView();
}