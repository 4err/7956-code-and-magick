'use strict';

define(function() {
  /**
   * @constructor
   * @extends {Backbone.Model}
   */
  var ReviewModel = Backbone.Model.extend({
    /**
     * @override
     */
    initialize: function() {
      this.set('useful', null);
    }
  });

  return ReviewModel;
});
