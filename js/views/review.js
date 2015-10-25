'use strict';

(function() {

  var ratingClassname = {
    1: 'review-rating-one',
    2: 'review-rating-two',
    3: 'review-rating-three',
    4: 'review-rating-four',
    5: 'review-rating-five'
  };

  var REQUEST_FAILURE_TIMEOUT = 10000;

  var reviewTemplate = document.getElementById('review-template');

  var ReviewView = Backbone.View.extend({
    initialize: function() {
      this._onImageLoad = this._onImageLoad.bind(this);
      this._onImageFail = this._onImageFail.bind(this);
      this._onModelUseful = this._onModelUseful.bind(this);
      this._onClick = this._onClick.bind(this);

      this.model.on('change:useful', this._onModelUseful);
    },
    events: {
      'click': '_onClick'
    },
    tagName: 'article',
    className: 'review',
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

    _onImageLoad: function(evt) {
      clearTimeout(this._imageLoadTimeout);

      var loadedImage = evt.path[0];
      this._cleanupImageListeners(loadedImage);
    },

    _onImageFail: function(evt) {
      var failedImage = evt.path[0];
      this._cleanupImageListeners(failedImage);

      this.el.classList.add('review-load-failure');
    },

    _onModelUseful: function() {
      this._updateUseful();
    },

    _updateUseful: function() {
      var yesButton = this.el.querySelector('.review-quiz-answer-yes');
      var noButton = this.el.querySelector('.review-quiz-answer-no');
      var useful = this.model.get('useful');

      yesButton.classList.remove('review-quiz-answer-active');
      noButton.classList.remove('review-quiz-answer-active');

      yesButton.classList.toggle('review-quiz-answer-active', useful);
      noButton.classList.toggle('review-quiz-answer-active', !useful);

//      switch (this.model.get('useful')) {
//        case 1:
//          yesButton.classList.add('review-quiz-answer-active');
//          break;
//        case 0:
//          noButton.classList.add('review-quiz-answer-active');
//          break;
//        case -1:
//          break;
//      }

    },
    _cleanupImageListeners: function(image) {
      image.removeEventListener('load', this._onImageLoad);
      image.removeEventListener('error', this._onImageError);
      image.removeEventListener('abort', this._onImageError);
    }
  });

  window.ReviewView = ReviewView;

})();
