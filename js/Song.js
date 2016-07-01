var Song = function(file) {
    this.file           = file;
    this.blobUrl        = URL.createObjectURL(file);
    this.title          = file.name;
    this.artist         = '';
    this.playlistImg    = 'img/song-icon-72.png';
    this.mainImg        = 'img/turntable.png';
};


Song.prototype.getId3tags = function() {
    var that = this;
    id3tags(this, function(tags) {
        console.log(tags);
        if (tags.v1 && !(tags.v2)) {
            that.title  = tags.v1.title;
            that.artist = tags.v1.artist;
            playlist.tagsReady();
        }
        if (tags.v2) {
            if(tags.v2.APIC) {
                that.playlistImg  = tags.v2.APIC.base64_data;
                that.mainImg = that.playlistImg;
            }
            if(tags.v2.TIT2) that.title  = tags.v2.TIT2.data;
            if(tags.v2.TPE1) that.artist = tags.v2.TPE1.data;
            playlist.tagsReady();
        }
    });
};


Song.prototype.showInfo = function() {

    var $coverImg   = document.querySelector('#songInfo img');
    var $artist     = document.querySelector('#songInfo .artist');
    var $title      = document.querySelector('#songInfo .title');

    $title.innerHTML  = this.title;
    $artist.innerHTML = this.artist;
    $coverImg.src     = this.mainImg;
};


Song.prototype.getSnippet = function() {
    return '<div class="song">' +
        '<div class="icon"><img src="' + this.playlistImg + '" width="72px"></div>' +
        '<p class="title">'  + this.title  + '</p>' +
        '<p class="artist">' + this.artist + '</p>' +
        '<span class="remove-song">x</span>' +
        '</div>';
};
