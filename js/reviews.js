'use strict';

(function() {

  var REQUEST_FAILURE_TIMEOUT = 10000;

  var reviewsFilter = document.querySelector('.reviews-filter');
  var reviewsContainer = document.querySelector('.reviews-list');
  var reviewsAll;
  var reviewsOnPage = 3;
  var currentPage = 0;
  var reviewsList;
  var renderedReviews = [];
  var nextButton = document.querySelector('.reviews-controls-more');

  function showMoreButton() {
    var show = currentPage < Math.ceil(reviewsList.length / reviewsOnPage) - 1;

    if (show) {
      nextButton.classList.remove('invisible');
    } else {
      nextButton.classList.add('invisible');
    }
  }

  function showNextReviews(event) {
    event.preventDefault();
    renderReviews(reviewsList, ++currentPage);
  }

  function renderReviews(reviews, page, updateList) {
    updateList = !!updateList;
    page = page || 0;

    if (updateList) {
      var el;
      while ((el = renderedReviews.shift())) {
        el.unrender();
      }

      reviewsContainer.classList.remove('reviews-load-failure');
    }

    var reviewFragment = document.createDocumentFragment();

    var reviewsFrom = reviewsOnPage * page;
    var reviewsTo = reviewsFrom + reviewsOnPage;
    reviews = reviews.slice(reviewsFrom, reviewsTo);

    reviews.forEach(function(reviewData) {
      var newReviewEl = new Review(reviewData);
      newReviewEl.render(reviewFragment);
      renderedReviews.push(newReviewEl);
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
    localStorage.setItem('filterName', filterName);

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

  function setActiveFilter(filterName) {
    reviewsList = filterReviews(reviewsAll, filterName);
    currentPage = 0;
    renderReviews(reviewsList, currentPage, true);
    document.getElementById(filterName).checked = true;
  }

  function initFilters() {
    var filterElements = document.querySelector('.reviews-filter');

    filterElements.addEventListener('click', function(event) {
      if (event.target.tagName === 'INPUT') {
        setActiveFilter(event.target.id);
      }
    });
  }

  initFilters();
  reviewsFilter.classList.add('invisible');
  reviewsContainer.classList.add('reviews-list-loading');
  nextButton.addEventListener('click', showNextReviews);

  ajax('data/reviews.json', 'get', function(err, loadedReviews) {
    reviewsContainer.classList.remove('reviews-list-loading');

    if (err) {
      reviewsContainer.classList.add('reviews-load-failure');
    } else {
      reviewsContainer.classList.remove('reviews-load-failure');
      reviewsAll = loadedReviews;
      setActiveFilter(localStorage.getItem('filterName') || 'reviews-all');
    }
  });

})();
