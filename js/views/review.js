'use stirct';

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
        var authorImage = new Image();

        authorImage.src = this.model.get('author').picture;
        authorImage.title = this.model.get('author').name;

        this._imageLoadTimeout = setTimeout(function() {
          this.el.classList.add('review-load-failure');
        }.bind(this), REQUEST_FAILURE_TIMEOUT);

        authorImage.addEventListener('load', this._onImageLoad);
        authorImage.addEventListener('error', this._onImageFail);
        authorImage.addEventListener('abort', this._onImageFail);
      }
      this._updateUseful();
    },

    _onClick: function(event) {
      var clickedElement = event.target;

      if (event.target.classList.contains('review-quiz-answer')) {
        if (event.target.classList.contains('review-quiz-answer-yes')) {
          this.model.useful();
        } else {
          this.model.unuseful();
        }
      }
    },

    _onImageLoad: function(evt) {
      clearTimeout(this._imageLoadTimeout);

      var loadedImage = evt.path[0];
      this._cleanupImageListeners(loadedImage);

      this.el.src = loadedImage.src;
      this.el.classList.add('review-author');
      this.el.style.width = '124px';
      this.el.style.height = '124px';
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

      yesButton.classList.remove('review-quiz-answer-active');
      noButton.classList.remove('review-quiz-answer-active');

      if (this.model.get('useful')) {
        yesButton.classList.add('review-quiz-answer-active');
      } else {
        noButton.classList.remove('review-quiz-answer-active');
      }

    },
    _cleanupImageListeners: function(image) {
      image.removeEventListener('load', this._onImageLoad);
      image.removeEventListener('error', this._onImageError);
      image.removeEventListener('abort', this._onImageError);
    }
  });

  window.ReviewView = ReviewView;

})();
