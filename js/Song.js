var Song = function(file) {
    this.file       = file;
    this.blobUrl    = URL.createObjectURL(file);
    var title       = file.name;
    var artist      = '';
    var album       = '';
    var playlistImg = 'img/song-icon-72.png';
    var mainImg     = 'img/turntable.png';

    var $coverImg   = document.querySelector('#songInfo img');
    var $artist     = document.querySelector('#songInfo .artist');
    var $title      = document.querySelector('#songInfo .title');
    
    
    
    this.getId3tags = function() {
        id3tags(this, function(tags, who) {
            console.log('Who returns: ' + who);
            console.log(tags);
            if (tags.v1 && !(tags.v2)) {
                title  = tags.v1.title;
                artist = tags.v1.artist;
                playlist.tagsReady();
            }
            if (tags.v2) {
                if(tags.v2.APIC) {
                    playlistImg  = tags.v2.APIC.base64_data;
                    mainImg = playlistImg;
                }
                if(tags.v2.TIT2) title  = tags.v2.TIT2.data;
                if(tags.v2.TPE1) artist = tags.v2.TPE1.data;
                playlist.tagsReady();
            }
        });
    };

    
    this.showInfo = function() {
        $title.innerHTML  = title;
        $artist.innerHTML = artist;
        $coverImg.src     = mainImg;
    };


    this.getSnippet = function() {
        return '<div class="song">' +
            '<div class="icon"><img src="' + playlistImg + '" width="72px"></div>' +
            '<p class="title">'  + title  + '</p>' +
            '<p class="artist">' + artist + '</p>' +
            '<span class="remove-song">x</span>' +
            '</div>';
    };

};