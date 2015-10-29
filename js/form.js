'use strict';

define(function() {
  /**
   * @type {Element}
   */
  var formContainer = document.querySelector('.overlay-container');

  /**
   * @type {Element}
   */
  var formOpenButton = document.querySelector('.reviews-controls-new');

  /**
   * @type {Element}
   */
  var formCloseButton = document.querySelector('.review-form-close');

  /**
   * Показ формы отзыва
   * @param {Event} event
   */
  formOpenButton.onclick = function(event) {
    event.preventDefault();
    formContainer.classList.remove('invisible');
  };

  /**
   * Скрытие формы отзыва
   * @param {Event} event
   */
  formCloseButton.onclick = function(event) {
    event.preventDefault();
    formContainer.classList.add('invisible');
  };
});
