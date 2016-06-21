var Song = function(file) {
    this.file       = file;
    this.blobUrl    = URL.createObjectURL(file);
    this.title      = file.name;
    this.artist     = '';
    this.album      = '';
    this.image      = '../img/song-icon-72.png';

    

    //getID3v1Tags(this);
    getID3v2Tags(this);

    this.getSnippet = function() {
        return '<div class="song">' +
            '<div class="icon"></div>' +
            '<p class="title">'  + this.title  + '</p>' +
            '<p class="artist">' + this.artist + '</p>' +
            '<span class="remove-song">x</span>' +
            '</div>';
    };

};