var Song = function(file) {
    this.file       = file;
    this.blobUrl    = URL.createObjectURL(file);
    var title      = file.name;
    var artist     = '';
    var album      = '';
    var image      = 'img/song-icon-72.png';
    
    this.getId3tags = function() {
        id3tags(this, function(tags) {
            //console.log(tags);
            if (tags.v1 && !(tags.v2)) {
                title  = tags.v1.title;
                artist = tags.v1.artist;
                playlist.tagsReady();
            }
            if (tags.v2) {
                if(tags.v2.APIC) image  = tags.v2.APIC.base64_data;
                if(tags.v2.TIT2) title  = tags.v2.TIT2.data;
                if(tags.v2.TPE1) artist = tags.v2.TPE1.data;
                playlist.tagsReady();
            }

        });

    };


    this.getSnippet = function() {
        return '<div class="song">' +
            '<div class="icon"><img src="' + image + '" width="72px"></div>' +
            '<p class="title">'  + title  + '</p>' +
            '<p class="artist">' + artist + '</p>' +
            '<span class="remove-song">x</span>' +
            '</div>';
    };

};