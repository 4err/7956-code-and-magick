'use strict';

define([
  'models/reviews',
  'views/review'
],
  function(ReviewsCollection, ReviewView) {

    var REQUEST_FAILURE_TIMEOUT = 10000;

    var reviewsFilter = document.querySelector('.reviews-filter');

    var reviewsContainer = document.querySelector('.reviews-list');

    var reviewsCollection = new ReviewsCollection();
    var currentPage = 0;
    //    var initiallyLoaded = [];
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
        reviewFragment.appendChild(view.el);
        renderedReviews.push(view);
      });

      reviewsContainer.appendChild(reviewFragment);
      reviewsFilter.classList.remove('invisible');
      showMoreButton();
    }

    function filterReviews(filterName) {
      var filteredReviews = reviewsCollection;

      switch (filterName) {
        case 'reviews-recent':
          //        filteredReviews.sort(function(a, b) {
          //          return new Date(b.date) - new Date(a.date);
          //        });
          filteredReviews.order_by_date();
          break;

        case 'reviews-good':
          //        filteredReviews = filteredReviews
          //          .filter(function(item) {
          //            return item.rating > 2;
          //          }).sort(function(a, b) {
          //            return b.rating - a.rating;
          //          });
          filteredReviews.order_by_good();
          break;

        case 'reviews-bad':
          //        filteredReviews = filteredReviews
          //          .filter(function(item) {
          //            return item.rating < 3;
          //          })
          //          .sort(function(a, b) {
          //            return a.rating - b.rating;
          //          });
          //        var test = filteredReviews.filter(function(model) {
          //          return model.get('rating') < 2;
          //        });
          //        filteredReviews.reset(test);
          //console.log(reviewsCollection)
          filteredReviews.order_by_bad();
          break;

        case 'reviews-popular':
          filteredReviews.order_by_popular();
          break;
        default:
          filteredReviews.order_by_default();
      }

      //    reviewsCollection.reset(filteredReviews);
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
          var filterName = event.target.id;
          setActiveFilter(filterName);
          location.hash = 'filters/' + filterName;
        }
      });
    }

    function parseURL() {
      var hash = location.hash;
      var hashRegExp = hash.match(/#filters\/(\S+)/);
      if (hashRegExp) {
        setActiveFilter(hashRegExp[1]);
      } else {
        setActiveFilter('reviews-all');
      }
    }

    window.addEventListener('hashchange', function() {
      parseURL();
    });

    reviewsFilter.classList.add('invisible');
    reviewsContainer.classList.add('reviews-list-loading');

    reviewsCollection.fetch({
      timeout: REQUEST_FAILURE_TIMEOUT
    }).success(function( /*loaded, state, jqXHR*/ ) {
      //      initiallyLoaded = jqXHR.responseJSON;
      reviewsCollection.map(function(model, index) {
        model.set('default', index);
      });
      initFilters();
      reviewsContainer.classList.remove('reviews-load-failure');
      nextButton.addEventListener('click', showNextReviews);
      reviewsContainer.classList.remove('reviews-list-loading');
      parseURL();
    }).fail(function() {
      reviewsContainer.classList.add('reviews-load-failure');
    });

  });
