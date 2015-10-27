'use strict';

(function() {
  var ReviewModel = Backbone.Model.extend({
    initialize: function() {
      this.set('useful', null);
    }
  });

  window.ReviewModel = ReviewModel;
})();
