'use strict';

var Decoder = {
    
    'getBitsFromByte': function(byte) {
        var str = '0000000' + byte.toString(2);
        return str.substring(str.length - 8);
    },

    'iso-8859-1': function(dv) {
        var str = '';
        for (var i = 1; i < dv.byteLength; i++) {
            str += String.fromCharCode(dv.getUint8(i));
        }
        return str;
    },

    'utf-16': function(dv) {
        var str = '';
        var endian = this.checkEndianness(dv.getUint8(1), dv.getUint8(2));
        var i = endian ? 3 : 1;
        for (i; i < dv.byteLength; i +=2) {
            if (endian === 'little') {
                str += String.fromCharCode(dv.getUint8(i) | dv.getUint8(i + 1) << 8);
            }
            if (endian == null || endian === 'big') {
                str += String.fromCharCode(dv.getUint8(i) << 8 | dv.getUint8(i + 1));
            }
        }
        return str;
    },

    'utf-16be': function(dv) {
        return this['utf-16'](dv);
    },

    'utf-8': function(dv) {
        var str = '%', char = '', endian = null;
        if (dv.byteLength >= 3) endian = this.checkEndianness(dv.getUint8(1), dv.getUint8(2));
        var i = endian ? 3 : 1;
        for (i; i < dv.byteLength; i++) {
            char = dv.getUint8(i).toString(16);
            if (char != 0) str += dv.getUint8(i).toString(16) + '%';
        }
        return decodeURIComponent(str.slice(0, -1));
    },

    // encoding not correctly detected
    'other' : function(dv) {
        return this['iso-8859-1'](dv);
    },

    checkEndianness: function(bom1, bom2) {
        if (bom1 === 255 && bom2 === 254) return 'little';
        else if (bom1 === 254 && bom1 === 255) return 'big';
        else return null;
    }
};