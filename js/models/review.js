'use strict';

define(function() {
  var ReviewModel = Backbone.Model.extend({
    initialize: function() {
      this.set('useful', null);
    }
  });

  return ReviewModel;
});
