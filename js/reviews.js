/*global
    ReviewsCollection: true
    ReviewView: true*/
'use strict';

(function() {

  var REQUEST_FAILURE_TIMEOUT = 10000;

  var reviewsFilter = document.querySelector('.reviews-filter');
  var reviewsContainer = document.querySelector('.reviews-list');
  var reviewsCollection = new ReviewsCollection();
  var currentPage = 0;
  var initiallyLoaded = [];
  var renderedReviews = [];
  var reviewsOnPage = 3;
  var nextButton = document.querySelector('.reviews-controls-more');

  function showMoreButton() {
    var show = currentPage < Math.ceil(reviewsCollection.length / reviewsOnPage) - 1;

    if (show) {
      nextButton.classList.remove('invisible');
    } else {
      nextButton.classList.add('invisible');
    }
  }

  function showNextReviews(event) {
    event.preventDefault();
    renderReviews(++currentPage);
  }

  function renderReviews(page, updateList) {
    page = page || 0;

    if (updateList) {
      while (renderedReviews.length) {
        var reviewToRemove = renderedReviews.shift();
        reviewsContainer.removeChild(reviewToRemove.el);
        reviewToRemove.remove();
      }
    }

    var reviewFragment = document.createDocumentFragment();

    var reviewsFrom = reviewsOnPage * page;
    var reviewsTo = reviewsFrom + reviewsOnPage;

    reviewsCollection.slice(reviewsFrom, reviewsTo).forEach(function(model) {
      var view = new ReviewView({
        model: model
      });
      view.render();
      console.log('render review');
      reviewFragment.appendChild(view.el);
      renderedReviews.push(view);
    });

    reviewsContainer.appendChild(reviewFragment);
    console.log(reviewsContainer, reviewFragment);
    reviewsFilter.classList.remove('invisible');
    showMoreButton();
  }

  function filterReviews(filterName) {
    var filteredReviews = initiallyLoaded.slice(0);
    localStorage.setItem('filterName', filterName);

    switch (filterName) {
      case 'reviews-recent':
        filteredReviews.sort(function(a, b) {
          return new Date(b.date) - new Date(a.date);
        });
        break;

      case 'reviews-good':
        filteredReviews
          .filter(function(item) {
            return item.rating > 2;
          })
          .sort(function(a, b) {
            return b.rating - a.rating;
          });
        break;
      case 'reviews-bad':
        filteredReviews
          .filter(function(item) {
            return item.rating < 3;
          })
          .sort(function(a, b) {
            return a.rating - b.rating;
          });
        break;
      case 'reviews-popular':
        filteredReviews.sort(function(a, b) {
          return b['review-rating'] - a['review-rating'];
        });
        break;
      default:

    }

    reviewsCollection.reset(filteredReviews);
  }

  function setActiveFilter(filterName) {
    filterReviews(filterName);
    currentPage = 0;
    renderReviews(currentPage, true);
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


//  reviewsFilter.classList.add('invisible');
//  reviewsContainer.classList.add('reviews-list-loading');

  reviewsCollection.fetch({
    timeout: REQUEST_FAILURE_TIMEOUT
  }).success(function(loaded, state, jqXHR) {
    initiallyLoaded = jqXHR.responseJSON;
    initFilters();
//    reviewsContainer.classList.remove('reviews-load-failure');
//    nextButton.addEventListener('click', showNextReviews);
//    reviewsFilter.classList.remove('invisible');
//    reviewsContainer.classList.remove('reviews-list-loading');
    setActiveFilter(localStorage.getItem('filterName') || 'reviews-all');
  }).fail(function() {
    reviewsContainer.classList.add('reviews-load-failure');
  });

})();
