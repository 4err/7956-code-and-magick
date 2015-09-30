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

  var reviewsFilter = document.querySelector('.reviews-filter');
  var reviewsContainer = document.querySelector('.reviews-list');
  var reviewsAll;
  var reviewsOnPage = 3;
  var currentPage = 0;
  var reviewsList;

  function showMoreButton() {
    var show = currentPage < Math.ceil(reviewsList.length / reviewsOnPage);
    var nextButton = document.querySelector('.reviews-controls-more');
    if (show) {
      nextButton.classList.remove('invisible');
      console.log(nextButton);
      nextButton.addEventListener('click', showNextReviews(event));
    } else {
      nextButton.classList.add('invisible');
    }
  }

  function showNextReviews(event) {
    event.preventDefault();
    console.log('Загрузка следующей страницы.');
    // renderReviews(reviewsList, currentPage++, false);
  }

  function renderReviews(reviews, page, updateList) {
    updateList = typeof updateList !== 'undefined' ? updateList : true;
    page = page || 0;

    if (updateList) {
      reviewsContainer.classList.remove('reviews-load-failure');
      reviewsContainer.innerHTML = '';
    }

    var reviewTemplate = document.getElementById('review-template');
    var reviewFragment = document.createDocumentFragment();

    var reviewsFrom = reviewsOnPage * page;
    var reviewsTo = reviewsFrom + reviewsOnPage;
    reviews = reviews.slice(reviewsFrom, reviewsTo);

    reviews.forEach(function(review) {
      var newReview = reviewTemplate.content.children[0].cloneNode(true);

      var originalImage = newReview.querySelector('.review-author');

      originalImage.title = review['author']['name'];
      newReview.querySelector('.review-rating').classList.add(ratingClassname[review['rating']]);
      newReview.querySelector('.review-text').textContent = review['description'];

      if (review['author']['picture']) {
        var authorImage = new Image();

        authorImage.src = review['author']['picture'];

        var imageLoadTimeout = setTimeout(function() {
          newReview.classList.add('review-load-failure');
        }, REQUEST_FAILURE_TIMEOUT);

        authorImage.onload = function() {
          authorImage.classList.add('review-author');
          authorImage.title = review['author']['name'];
          authorImage.style.width = '124px';
          authorImage.style.height = '124px';
          newReview.replaceChild(authorImage, originalImage);
          clearTimeout(imageLoadTimeout);
        };

        authorImage.onerror = function() {
          newReview.classList.add('review-load-failure');
        };
      }

      reviewFragment.appendChild(newReview);
    });

    reviewsContainer.appendChild(reviewFragment);
    reviewsFilter.classList.remove('invisible');
    showMoreButton();
  }

  function ajax(url, type, callback) {
    var xhr = new XMLHttpRequest();
    xhr.timeout = REQUEST_FAILURE_TIMEOUT;
    xhr.open(type, url);
    xhr.send();

    xhr.onreadystatechange = function(event) {
      var load = event.target;

      if (load.readyState === 4) {
        if (load.status === 200) {
          var data = load.response;
          return callback(null, JSON.parse(data));
        }

        if (load.status > 400) {
          return callback(new Error(load.status));
        }
      }
    };

    xhr.ontimeout = function() {
      return callback(new Error('Timeout'));
    };
  }

  function filterReviews(reviews, filterName) {
    var filteredReviews = reviews.slice(0);

    switch (filterName) {
      case 'reviews-recent':
        return filteredReviews.sort(function(a, b) {
          return new Date(b.date) - new Date(a.date);
        });

      case 'reviews-good':
        return filteredReviews
          .filter(function(item) {
            return item.rating > 2;
          })
          .sort(function(a, b) {
            return b.rating - a.rating;
          });

      case 'reviews-bad':
        return filteredReviews
          .filter(function(item) {
            return item.rating < 3;
          })
          .sort(function(a, b) {
            return a.rating - b.rating;
          });

      case 'reviews-popular':
        return filteredReviews.sort(function(a, b) {
          return b['review-rating'] - a['review-rating'];
        });

      default:
        return reviews.slice(0);
    }
  }

  function setActiveFilter(filterId) {
    reviewsList = filterReviews(reviewsAll, filterId);
    renderReviews(reviewsList, currentPage, true);
  }

  function initFilters() {
    var filterElements = document.querySelectorAll('.reviews-filter-item');
    for (var i = 0, l = filterElements.length; i < l; i++) {
      filterElements[i].onclick = function(event) {
        var clickedFilter = event.currentTarget;
        setActiveFilter(clickedFilter.htmlFor);
      };
    }
  }

  initFilters();
  reviewsFilter.classList.add('invisible');
  reviewsContainer.classList.add('reviews-list-loading');

  ajax('data/reviews.json', 'get', function(err, loadedReviews) {
    reviewsContainer.classList.remove('reviews-list-loading');

    if (err) {
      reviewsContainer.classList.add('reviews-load-failure');
    } else {
      reviewsContainer.classList.remove('reviews-load-failure');
      reviewsAll = loadedReviews;
      setActiveFilter('reviews-all');
    }
  });

})();
