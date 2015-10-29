'use strict';

define(function() {
  /**
  * @constructor
  * @extends {Backbone.View}
  */
  var GalleryPicture = Backbone.View.extend({
    tagName: 'img',

    render: function() {
      this.el.src = this.model.get('url');
    }
  });

  return GalleryPicture;
});
