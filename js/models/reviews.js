'use strict';

define([
  'models/review'
], function(ReviewModel) {
  /**
   * @constructor
   * @extends {Backbone.Collection}
   * @type {Object} options
   */
  var ReviewsCollection = Backbone.Collection.extend({
    model: ReviewModel,
    url: 'data/reviews.json',
    /**
     * @override
     */
    initialize: function() {
      this._orderById = this.comparator;
    },
    /**
     * Компаратор. Функция сравнения по умолчанию
     * @param   {Object}   ab
     * @returns {number}
     */
    comparator: function(ab) {
      return -ab.id;
    },
    /**
     * Сортировка по дате
     */
    orderByDate: function() {
      this.comparator = this._orderByDate;
      this.sort();
    },
    /**
     * Сортировка по оценкам. Сначала высокие
     */
    orderByGood: function() {
      this.comparator = this._orderByGood;
      this.sort();
    },
    /**
     * Сортировка по оценкам. Сначала низкие
     */
    orderByBad: function() {
      this.comparator = this._orderByBad;
      this.sort();
    },
    /**
     * Сортировка по популярности
     */
    orderByPopular: function() {
      this.comparator = this._orderByPopular;
      this.sort();
    },
    /**
     * Сортировка по умолчанию
     */
    orderByDefault: function() {
      this.comparator = this._orderBy_id;
      this.sort();
    },
    /**
     * Функция сортировки по дате.
     * @private
     * @param   {Date} a
     * @param   {Date} b
     * @returns {number}
     */
    _orderByDate: function(a, b) {
      return new Date(b.get('date')) - new Date(a.get('date'));
    },
    /**
     * Функция сортировки по оценкам.
     * @private
     * @param   {Object} a
     * @returns {number}
     */
    _orderByGood: function(a) {
      return -a.get('rating');
    },
    /**
     * Функция сортировки по оценкам.
     * @private
     * @param   {Object} a
     * @returns {number}
     */
    _orderByBad: function(a) {
      return a.get('rating');
    },
    /**
     * Функция сортировки по популярности.
     * @private
     * @param   {Object} a
     * @returns {number}
     */
    _orderByPopular: function(a) {
      return -a.get('review-rating');
    }

  });

  return ReviewsCollection;
});
