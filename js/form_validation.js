'use strict';

define(function() {
  var form = document.forms[1];

  var reviewName = form['review-name'];
  var reviewText = form['review-text'];
  var reviewMark = form['review-mark'];

  var labelForm = document.getElementsByClassName('review-fields')[0];
  var labelName = labelForm.getElementsByClassName('review-fields-name')[0];
  var labelText = labelForm.getElementsByClassName('review-fields-text')[0];

  /**
   * Проверка заполнения обязательных полей формы
   * @returns {boolean}
   */
  function checkValidation() {
    if (reviewName.value !== '') {
      labelName.style.display = 'none';
    } else {
      labelName.style.display = '';
    }

    if (reviewText.value !== '') {
      labelText.style.display = 'none';
    } else {
      labelText.style.display = '';
    }

    if (reviewName.value !== '' && reviewText.value !== '') {
      labelForm.style.display = 'none';
      return true;
    }

    labelForm.style.display = '';
    return false;
  }

  /**
   * Запись данных в форму из Cookies
   */
  function updateFieldsFromCookies() {
    reviewName.value = docCookies.getItem('name');
    reviewMark.value = docCookies.getItem('mark');

    checkValidation();
  }

  /**
   * Валидация при изменении имени.
   */
  reviewName.onchange = function() {
    checkValidation();
  };

  /**
   * Валидация при изменении текста
   */
  reviewText.onchange = function() {
    checkValidation();
  };

  /**
   * Проверка валидации и сохранение данных при отправке формы.
   * @param {Event} event
   */
  form.onsubmit = function(event) {
    event.preventDefault();

    if (checkValidation()) {
      var time = new Date().getTime();
      var cookiesAge = time + (time - new Date('27 December 1990').getTime());

      docCookies.setItem('name', reviewName.value, cookiesAge);
      docCookies.setItem('mark', reviewMark.value, cookiesAge);

      form.submit();
    }

    labelForm.style.color = 'red';
  };

  updateFieldsFromCookies();

});
