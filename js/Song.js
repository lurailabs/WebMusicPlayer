var Song = function(file) {
    var blobUrl     = URL.createObjectURL(file);
    var fileName    = file.name;
    var title;
    var artist;
    var image;
    var snippet = '<div class="song">' +
        '<p class="title">'  + fileName  + '</p>' +
        '<p class="artist">' + '---' + '</p>' +
        '<span class="remove-song">x</span>' +
        '</div>';
    
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
    
    var getSnippet = function() {
        return snippet;
    };
    
    
    
    
    return {
        getBlobUrl:     getBlobUrl,
        getFileName:    getFileName,
        getArtist:      getArtist,
        getImage:       getImage, 
        getSnippet:     getSnippet
    }
};