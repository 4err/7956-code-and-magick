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
    var originCollectionData;
    var currentPage = 0;
    var renderedReviews = [];
    var reviewsOnPage = 3;
    var currentFilter = '';
    var nextButton = document.querySelector('.reviews-controls-more');

    /**
     * Показ или скрытие кнопки "Показать еще отзывы"
     */
    function showMoreButton() {
      var show = currentPage < Math.ceil(reviewsCollection.length / reviewsOnPage) - 1;

      if (show) {
        nextButton.classList.remove('invisible');
      } else {
        nextButton.classList.add('invisible');
      }
    }

    /**
     * Показ следующей страницы отзывов
     * @param {Event} event
     */
    function showNextReviews(event) {
      event.preventDefault();
      renderReviews(++currentPage);
    }

    /**
     * Отрисовака отзывов
     * @param {number}  [page=0]   Номер страницы
     * @param {boolean=} updateList Загрузить новый список или дополнить старый.
     */
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

    /**
     * Обработчик переключения фильтрации отзывов
     * @param {string} filterName
     */
    function filterReviews(filterName) {

      if (reviewsCollection.length !== originCollectionData.length) {
        reviewsCollection.reset(originCollectionData);
        var filtered;
      }

      switch (filterName) {
        case 'reviews-recent':
          reviewsCollection.orderByDate();
          break;

        case 'reviews-good':
          filtered = originCollectionData.filter(function(model) {
            return model.get('rating') > 2;
          });
          reviewsCollection.reset(filtered);
          reviewsCollection.orderByGood();
          break;

        case 'reviews-bad':
          filtered = originCollectionData.filter(function(model) {
            return model.get('rating') < 3;
          });
          reviewsCollection.reset(filtered);
          reviewsCollection.orderByBad();
          break;

        case 'reviews-popular':
          reviewsCollection.orderByPopular();
          break;
        default:
          reviewsCollection.orderByDefault();
      }
    }

    /**
     * Выбор текущего фильтра
     * @param {string} filterName
     */
    function setActiveFilter(filterName) {
      filterReviews(filterName);
      currentPage = 0;
      renderReviews(currentPage, true);
      document.getElementById(filterName).checked = true;
    }

    /**
     * Привязка события смены фильтра к кнопкам фильтрации.
     */
    function initFilters() {
      var filterElements = document.querySelector('.reviews-filter');

      filterElements.addEventListener('click', function(event) {
        if (event.target.tagName === 'INPUT') {
          location.hash = 'filters/' + event.target.id;
        }
      });
    }

    /**
     * Разбор адреса для применения нужного фильтра.
     */
    function parseURL() {
      var hash = location.hash;
      var hashRegExp = hash.match(/#filters\/(\S+)/);
      var filterName = 'reviews-all';

      if (hashRegExp) {
        filterName = hashRegExp[1];
      }

      if (currentFilter !== filterName) {
        currentFilter = filterName;
        setActiveFilter(filterName);
      }
    }

  /**
   * Обработчик изменения хэша в адресе страницы.
  */
    window.addEventListener('hashchange', parseURL);

    reviewsFilter.classList.add('invisible');
    reviewsContainer.classList.add('reviews-list-loading');

    reviewsCollection.fetch({
      timeout: REQUEST_FAILURE_TIMEOUT
    }).success(function() {
      initFilters();
      originCollectionData = reviewsCollection.filter();
      reviewsContainer.classList.remove('reviews-load-failure');
      nextButton.addEventListener('click', showNextReviews);
      reviewsContainer.classList.remove('reviews-list-loading');
      parseURL();
    }).fail(function() {
      reviewsContainer.classList.add('reviews-load-failure');
    });

  });
