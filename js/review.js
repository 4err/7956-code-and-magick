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

  var Review = function(data) {
    this._data = data;
  };

  Review.prototype.render = function(container) {
    var newReview = reviewTemplate.content.children[0].cloneNode(true);

    var originalImage = newReview.querySelector('.review-author');

    originalImage.title = this._data['author']['name'];
    newReview.querySelector('.review-rating').classList.add(ratingClassname[this._data['rating']]);
    newReview.querySelector('.review-text').textContent = this._data['description'];

    if (this._data['author']['picture']) {
      var authorImage = new Image();

      authorImage.src = this._data['author']['picture'];
      authorImage.title = this._data['author']['name'];

      var imageLoadTimeout = setTimeout(function() {
        newReview.classList.add('review-load-failure');
      }, REQUEST_FAILURE_TIMEOUT);

      authorImage.onload = function() {
        authorImage.classList.add('review-author');
        authorImage.style.width = '124px';
        authorImage.style.height = '124px';
        newReview.replaceChild(authorImage, originalImage);
        clearTimeout(imageLoadTimeout);
      };

      authorImage.onerror = function() {
        newReview.classList.add('review-load-failure');
      };
    }

    container.appendChild(newReview);
    this._element = newReview;
  };

  Review.prototype.unrender = function() {
    this._element.parentNode.removeChild(this._element);
    this._element = null;
  };

  window.Review = Review;
})();
