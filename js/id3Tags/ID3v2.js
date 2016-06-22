function getID3v2Tags(file, done) {

    console.log('file length: ' + file.size);
    var position = 0;

    var id3v2 = {
        header: {}
    };

    window.addEventListener('error', function(msg) {
        console.log(msg);
        done(id3v2);
        return true;
    });

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

    var read = function(end, method, done) {
        /*
        console.log('* Read params *');
        console.log('position: ' + position);
        console.log('end: ' + end);
        console.log('method: ' + method);
        */
        var reader = new FileReader();
        var data = file.slice(position, end);
        reader.addEventListener('load', function(event) {
            var result = event.target.result;
            //console.log('bytes read in read: ' + result.byteLength);
            done(result);
        });
        reader[method](data);

    };

    var getHeader = function() {

        read(10,
            'readAsArrayBuffer',
            function(result) {
                var dv = new DataView(result);
                id3v2.header = {
                    'id3': String.fromCharCode(dv.getUint8(0), dv.getUint8(1), dv.getUint8(2)),
                    'version': [dv.getUint8(3), dv.getUint8(4)],
                    'flags': Decoder.getBitsFromByte(dv.getUint8(5)),
                    'bodySize': dv.getUint32(6)
                };

                position = 10;

                getFrameHeader();
            }
        );
    };

    var getFrameHeader = function() {

        read(position + 10,
            'readAsArrayBuffer',
            function (buffer) {
                var dv = new DataView(buffer);
                var frameId    = getFrameId(dv);
                var frameSize  = dv.getUint32(4); //getFrameSize(dv);

                position += 10;
                console.log('frame Id: ' + frameId);
                console.log('frame size: ' + frameSize);
                if (frameIds.indexOf(frameId) === -1) {
                    position++;
                    if (position >= dv.byteLength - 10) {
                        console.log('out of id3 tags bounds');
                        done(id3v2);
                    }
                    else getFrameHeader();

                } else {
                    id3v2[frameId] = {};
                    id3v2[frameId].flags = getFrameFlags(dv);

                    if (frameId === 'APIC') {
                        id3v2[frameId].size = dv.getUint32(4);
                        getPicFrameData(frameId, id3v2[frameId].size);

                    } else {
                        id3v2[frameId].size = frameSize;
                        getTextFrameData(frameId, id3v2[frameId].size);

                    }
                }
            }
        );
    };

    var getFrameId = function(dataView) {

        var frameId = '';
        for (var i = 0; i < 4; i++) {
            frameId += String.fromCharCode(dataView.getUint8(i));
        }
        return frameId;
    };

    var getFrameSize = function(dataView) {

        return (dataView.getUint8(4) << 21) | (dataView.getUint8(5) << 14) |
            (dataView.getUint8(6) << 7) | dataView.getUint8(7);
    };

    var getFrameFlags = function(dataView) {

        return [
            Decoder.getBitsFromByte(dataView.getUint8(8)),
            Decoder.getBitsFromByte(dataView.getUint8(9))
        ];
    };


    var getTextFrameData = function(frameId, size) {

        read(position + size,
            'readAsArrayBuffer',
            function(buffer) {
                var dv = new DataView(buffer);
                var encoding = getTextEncoding(dv.getUint8(0));
                id3v2[frameId].encoding = encoding;
                id3v2[frameId].data = Decoder[encoding](dv);
                console.log(id3v2[frameId].data);
                position += size;
                if (position >= id3v2.header.bodySize - 10) done(id3v2);
                else getFrameHeader();
            }
        );
    };


    var getPicFrameData = function(frameId, size) {
        console.log('Fetching pic frame data...');
        read(position + size,
            'readAsArrayBuffer',
            function(buffer) {
                var dv = new DataView(buffer);

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
                var dvPosition = 1;
                while (dv.getUint8(dvPosition) !== 0x00) {
                    mimeType += String.fromCharCode( dv.getUint8(dvPosition) );
                    dvPosition++;
                }
                dvPosition += 1;  // $00 after MIME type
                var picType = pictureTypes[dv.getUint8(dvPosition)];
                dvPosition += 1;
                while (dv.getUint8(dvPosition) !== 0x00) {
                    description += String.fromCharCode( dv.getUint8(dvPosition) );
                    dvPosition++;
                }
                dvPosition += 1;  // $00 after description


                while(dvPosition < dv.byteLength) {
                    data += String.fromCharCode( dv.getUint8(dvPosition) );
                    dvPosition++;
                }
                var base64 = 'data:' + mimeType + ';base64,' + window.btoa(data);

                id3v2[frameId].encoding     = encoding;
                id3v2[frameId].mimeType     = mimeType;
                id3v2[frameId].pictureType  = picType;
                id3v2[frameId].description  = description;
                id3v2[frameId].base64_data  = base64;

                position += size;
                if (position >= id3v2.header.bodySize - 10) done(id3v2);
                else getFrameHeader();
            }
        );

    };




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

    getHeader();

}