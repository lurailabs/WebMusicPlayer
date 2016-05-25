var Song = function(file) {
    var file = file;
    var name = file.name;
    var artist;
    var image;

    var getFile = function() {
        return file;
    };
    
    var getName = function() {
        return name;
    };

    var getArtist = function() {
        return artist;
    };

    var getImage = function() {
        return image;
    };
    
    
    
    return {
        getFile:    getFile,
        getName:    getName,
        getArtist:  getArtist,
        getImage:   getImage
    }
};