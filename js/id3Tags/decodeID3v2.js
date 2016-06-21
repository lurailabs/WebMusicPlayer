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
            console.log('original buffer size; ' + buffer.byteLength);
            readHeader( new DataView(buffer, 0, 10) );
            if (id3v2.header.id3 === 'ID3') {

                // some files have tags with size bigger than file size
                if (id3v2.header.bodySize > buffer.byteLength - 10) {
                    id3v2.header.bodySize = buffer.byteLength -10;
                }

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
            'bodySize': dv.getUint32(6)
        };
    };

    var readBody = function(dv) {

        var position = 0, frameId = '', frameSize = 0, frameFlags = [], data = '', num = 0;

        do {
            frameId = getFrameId(dv, position);

            if (frameIds.indexOf(frameId) === -1) {
                position++;
                if (position >= dv.byteLength - 10) {
                    console.log('out of id3 tags bounds');
                    break;
                }
                else continue;
            }

            frameSize = dv.getUint32(position + 4);
            // Frame size corrected if number is wrong (too big)
            if (frameSize > dv.buffer.byteLength - position - 20) {
                frameSize = dv.buffer.byteLength - position - 20;
            }

            frameFlags = [
                Decoder.getBitsFromByte(dv.getUint8(position + 8)),
                Decoder.getBitsFromByte(dv.getUint8(position + 9))
            ];

            console.log('Frame ID: ' + frameId + ' - Frame size: ' + frameSize);

            if (frameId === 'APIC') {
                data = getPicFrameData (new DataView(dv.buffer, position + 20, frameSize));
            } else {
                data = getTextFrameData(new DataView(dv.buffer, position + 20, frameSize));
            }

            position += 10 + frameSize;

            // Adds num. to property name if several tags with same id (usually iTunes TXXX tags)
            if (id3v2.hasOwnProperty(frameId))  frameId += '-' + num++;

            id3v2[frameId]       = data;
            id3v2[frameId].size  = frameSize;
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


    var getTextFrameData = function(dv) {

        var encoding    = getTextEncoding(dv.getUint8(0));
        return {
            encoding:   encoding,
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