var Song = function(file) {
    this.file       = file;
    this.blobUrl    = URL.createObjectURL(file);
    this.title      = file.name;
    this.artist     = '';
    this.album      = '';
    this.image      = '../img/song-icon-72.png';


    getID3v1Tags(this, function(tags) {
        console.log('ID3 v.1 TAGS: ');
        console.log(tags);
    });

    getID3v2Tags(this, function(tags) {
        console.log('ID3 v.2 TAGS: ');
        console.log(tags);
    });
    

    this.getSnippet = function() {
        return '<div class="song">' +
            '<div class="icon"></div>' +
            '<p class="title">'  + this.title  + '</p>' +
            '<p class="artist">' + this.artist + '</p>' +
            '<span class="remove-song">x</span>' +
            '</div>';
    };

};