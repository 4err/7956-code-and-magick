/*global
    ReviewModel: true*/

'use strict';

(function() {
  var ReviewsCollection = Backbone.Collection.extend({
    model: ReviewModel,
    url: 'data/reviews.json',
    initialize: function() {
      this._order_by_id = this.comparator;
    },
    comparator: function(ab) {
      return -ab.id;
    },
    order_by_date: function() {
      this.comparator = this._order_by_date;
      this.sort();

    },
    order_by_good: function() {
      this.comparator = this._order_by_good;
      this.sort();
    },
    order_by_bad: function() {
      this.comparator = this._order_by_bad;
      this.sort();
    },
    order_by_popular: function() {
      this.comparator = this._order_by_popular;
      this.sort();
    },
    order_by_default: function() {
      this.comparator = this._order_by_id;
      this.sort();
    },
    _order_by_date: function(a, b) {
      return new Date(b.get('date')) - new Date(a.get('date'))
    },
    _order_by_good: function(a) {
      return -a.get('rating');
    },
    _order_by_bad: function(a) {
      return a.get('rating');
    },
    _order_by_popular: function(a) {
      return -a.get('review-rating');
    }

  });

  window.ReviewsCollection = ReviewsCollection;
})();
