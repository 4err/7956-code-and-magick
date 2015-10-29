'use strict';

define(function() {
  /**
   * @type {Object.<number, string>}
   */
  var ratingClassname = {
    1: 'review-rating-one',
    2: 'review-rating-two',
    3: 'review-rating-three',
    4: 'review-rating-four',
    5: 'review-rating-five'
  };

  /**
   * @const
   * @type {number}
   */
  var REQUEST_FAILURE_TIMEOUT = 10000;

  /**
   * @type {Element}
   */
  var reviewTemplate = document.getElementById('review-template');

  /**
   * @constructor
   * @extends {Backbone.View}
   */
  var ReviewView = Backbone.View.extend({
    /**
     * @override
     */
    initialize: function() {
      this._onImageLoad = this._onImageLoad.bind(this);
      this._onImageFail = this._onImageFail.bind(this);
      this._onModelUseful = this._onModelUseful.bind(this);
      this._onClick = this._onClick.bind(this);

      this.model.on('change:useful', this._onModelUseful);
    },

    /**
     * Обработка событий по клику.
     * @type {Object.<string, string>}
     */
    events: {
      'click': '_onClick'
    },

    /**
     * Тэг, в котором будет размещаться элемент представления.
     * @type {string}
     * @override
     */
    tagName: 'article',

    /**
     * Класс элемента
     * @type {string}
     * @override
     */
    className: 'review',

    /**
     * Отрисовка элемента представления.
     * @override
     */
    render: function() {
      this.el.appendChild(reviewTemplate.content.children[0].cloneNode(true));

      var originalImage = this.el.querySelector('.review-author');

      originalImage.title = this.model.get('author').name;
      this.el.querySelector('.review-rating').classList.add(ratingClassname[this.model.get('rating')]);
      this.el.querySelector('.review-text').textContent = this.model.get('description');

      if (this.model.get('author').picture) {
        originalImage.src = this.model.get('author').picture;

        this._imageLoadTimeout = setTimeout(function() {
          this.el.classList.add('review-load-failure');
        }.bind(this), REQUEST_FAILURE_TIMEOUT);

        originalImage.addEventListener('load', this._onImageLoad);
        originalImage.addEventListener('error', this._onImageFail);
        originalImage.addEventListener('abort', this._onImageFail);
      }

      this._updateUseful();
    },

    /**
     * Обработчик клика по отзыву. Изменяет состояния полезности отзыва.
     * @private
     * @param {Object} event
     */
    _onClick: function(event) {
      var clickedElement = event.target;

      if (clickedElement.classList.contains('review-quiz-answer')) {
        if (clickedElement.classList.contains('review-quiz-answer-yes')) {
          this.model.set('useful', true);
        } else {
          this.model.set('useful', false);
        }
      }
    },

    /**
     * Обработчик загруженного изображения
     * @private
     * @param {Event} event
     */
    _onImageLoad: function(event) {
      clearTimeout(this._imageLoadTimeout);

      var loadedImage = event.path[0];
      this._cleanupImageListeners(loadedImage);
    },

    /**
     * Обработчик ошибки загрузки изображения
     * @private
     * @param {Object} event
     */
    _onImageFail: function(event) {
      var failedImage = event.path[0];
      this._cleanupImageListeners(failedImage);

      this.el.classList.add('review-load-failure');
    },

    /**
     * Обработчик изменения статуса отзыва
     * @private
     */
    _onModelUseful: function() {
      this._updateUseful();
    },

    /**
     * Обновление статуса отзыва
     * @private
     */
    _updateUseful: function() {
      var yesButton = this.el.querySelector('.review-quiz-answer-yes');
      var noButton = this.el.querySelector('.review-quiz-answer-no');
      var useful = this.model.get('useful');

      yesButton.classList.remove('review-quiz-answer-active');
      noButton.classList.remove('review-quiz-answer-active');

      if (useful !== null) {
        yesButton.classList.toggle('review-quiz-answer-active', useful);
        noButton.classList.toggle('review-quiz-answer-active', !useful);
      }
    },

    /**
     * Удаление обработчиков событий загрузки изображения
     * @param {Image} image
     * @private
     */
    _cleanupImageListeners: function(image) {
      image.removeEventListener('load', this._onImageLoad);
      image.removeEventListener('error', this._onImageError);
      image.removeEventListener('abort', this._onImageError);
    }
  });

  return ReviewView;

});
