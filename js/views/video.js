'use strict';

define(function() {

  var GalleryVideo = Backbone.View.extend({
    initialize: function() {
      this._onClick = this._onClick.bind(this);
    },

    render: function() {
      var video = document.createElement('video');
      video.src = this.model.get('url');
      video.autoplay = true;
      video.loop = true;
      video.poster = this.model.get('preview');
      video.addEventListener('click', this._onClick);
      this.el = video;
    },

    _onClick: function() {
      if (this.el.paused) {
        this.el.play();
      } else {
        this.el.pause();
      }
    }
  });

  return GalleryVideo;
});
