'use strict';

(function() {
  var ReviewModel = Backbone.Model.extend({
    initialize: function() {
      this.set('useful', null);
    }
//    useful: function() {
//      this.set('useful', 1);
//    },
//    unuseful: function() {
//      this.set('useful', 0);
//    }
  });

  window.ReviewModel = ReviewModel;
})();
