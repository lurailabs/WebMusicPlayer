var Id3v1 = {

    getDataView: function(file) {
        var reader = new FileReader();
        reader.addEventListener('load', function(event) {
            var data = event.target.result;
            var dataView = new DataView(data, data.byteLength - 128, 128);
            this.readInfo(dataView);
        });
        reader.readAsArrayBuffer(file);
    },
    hasId3v1Tags: function(dv) {
        var tag = '';
        for (var i = 0; i < 3; i++) {
            tag += String.fromCharCode(dv.getUint8(i));
        }
        console.log('tag: ' + tag);
        return tag === 'TAG';
    },

    // dv: dataView, start: first byte, end: last byte
    decodeField: function(dv, start, end) {
        var str = '';
        for (var i = start; i < end + 1; i++) {
            str += String.fromCharCode(dv.getUint8(i));
        }
    },

    readInfo: function(dv) {
        if (!this.hasId3v1Tags()) return null;
        return {
            title:  this.decodeField(dv, 3, 30),
            artist: this.decodeField(dv, 31, 60),
            album:  this.decodeField(dv, 61, 90),
            year:   this.decodeField(dv, 91, 94),
            track:  this.decodeField(dv, 126, 126),
            genre:  this.decodeField(dv, 127, 127)
        }
    },
    
    get: function(file) {
        this.getDataView(file);
    }
};
