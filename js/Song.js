var Song = function(file) {
    var blobUrl     = URL.createObjectURL(file);
    var fileName    = file.name;
    var title;
    var artist;
    var image;
    
    var getBlobUrl = function() {
        return blobUrl;
    };
    
    var getFileName = function() {
        return fileName;
    };

    var getTitle = function() {
        return title;
    };
    
    var getArtist = function() {
        return artist;
    };

    var getImage = function() {
        return image;
    };
    
    
    
    return {
        getBlobUrl:     getBlobUrl,
        getFileName:    getFileName,
        getArtist:      getArtist,
        getImage:       getImage
    }
};