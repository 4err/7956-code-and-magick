'use strict';

define([
  'views/photo',
  'views/video'
], function(GalleryPicture, GalleryVideo) {

  /**
   * @type {Object.<string, number>}
   */
  var Key = {
    'ESC': 27,
    'LEFT': 37,
    'RIGHT': 39
  };

  /**
   * Проверка попадания числа в пределы
   * @param   {Number} value
   * @param   {Number} min
   * @param   {Number} max
   * @returns {Number}
   */
  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * Конструктор объекта фотогалереи
   * @constructor
   */
  var Gallery = function() {
    this._galleryOverlay = document.querySelector('.overlay-gallery');
    this._closeButton = this._galleryOverlay.querySelector('.overlay-gallery-close');
    this._leftButton = this._galleryOverlay.querySelector('.overlay-gallery-control-left');
    this._rightButton = this._galleryOverlay.querySelector('.overlay-gallery-control-right');
    this._pictureElement = this._galleryOverlay.querySelector('.overlay-gallery-preview');

    this._currentPhoto = -1;
    this._photos = new Backbone.Collection();

    this._onCloseClick = this._onCloseClick.bind(this);
    this._onLeftButtonClick = this._onLeftButtonClick.bind(this);
    this._onRightButtonClick = this._onRightButtonClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
  };

  /**
   * Отображение галереи на странице
   */
  Gallery.prototype.showGallery = function() {
    this._galleryOverlay.classList.remove('invisible');
    this._closeButton.addEventListener('click', this._onCloseClick);
    this._leftButton.addEventListener('click', this._onLeftButtonClick);
    this._rightButton.addEventListener('click', this._onRightButtonClick);
    document.body.addEventListener('keydown', this._onKeyDown);
  };

  /**
   * Скрытие галереи
   */
  Gallery.prototype.hideGallery = function() {
    this._galleryOverlay.classList.add('invisible');
    this._closeButton.removeEventListener('click', this._onCloseClick);
    this._leftButton.removeEventListener('click', this._onLeftButtonClick);
    this._rightButton.removeEventListener('click', this._onRightButtonClickn);
    document.body.removeEventListener('keydown', this._onKeyDown);

    this._currentPhoto = 0;
  };

  /**
   * Показ текущей фотографии галереи
   */
  Gallery.prototype.showCurrentPhoto = function() {
    this._pictureElement.innerHTML = '';

    var photoModel = this._photos.at(this._currentPhoto);
    var element;

    if (photoModel.get('preview')) {
      element = new GalleryVideo({
        model: photoModel
      });
    } else {
      element = new GalleryPicture({
        model: photoModel
      });
    }

    element.render();
    this._pictureElement.appendChild(element.el);
  };

  /**
   * Событие клика по закрывающему крестику
   * @private
   * @param {Event} event
   */
  Gallery.prototype._onCloseClick = function(event) {
    event.preventDefault();
    this.hideGallery();
  };

  /**
   * Событие клика по стрелке влево
   * @private
   * @param {Event} event
   */
  Gallery.prototype._onLeftButtonClick = function(event) {
    event.preventDefault();
    this._showPrevImage();
  };

  /**
   * Событие клика по стрелке вправо
   * @private
   * @param {Event} event
   */
  Gallery.prototype._onRightButtonClick = function(event) {
    event.preventDefault();
    this._showNextImage();
  };

  /**
   * Показ следующего изображения
   * @private
   */
  Gallery.prototype._showNextImage = function() {
    this.setCurrentPhoto(this._currentPhoto + 1);
  };

  /**
   * Показ предыдущего изображения
   * @private
   */
  Gallery.prototype._showPrevImage = function() {
    this.setCurrentPhoto(this._currentPhoto - 1);
  };

  /**
   * Обработчик нажатий клавиш с клавиатуры
   * @private
   * @param {Event} event
   */
  Gallery.prototype._onKeyDown = function(event) {
    switch (event.keyCode) {
      case Key.LEFT:
        this._showPrevImage();
        break;
      case Key.RIGHT:
        this._showNextImage();
        break;
      case Key.ESC:
      default:
        this.hideGallery();
        break;
    }
  };

  /**
   * Внесения списка фотографий в коллекцию
   * @param   {Object.<string,string> photos
   * @returns {Backbone.Model}
   */
  Gallery.prototype.setPhotos = function(photos) {
    this._photos.reset(photos.map(function(photo) {
      return new Backbone.Model({
        url: photo.src,
        preview: photo.preview
      });
    }));
  };

  /**
   * Установка текущего фото
   * @param {Number} num
   */
  Gallery.prototype.setCurrentPhoto = function(num) {
    num = clamp(num, 0, this._photos.length - 1);

    if (this._currentPhoto !== num) {
      this._currentPhoto = num;
      this.showCurrentPhoto();
    }
  };

  /**
   * Поиск номера фотографии нажатой пользователем
   * @param {Object}   currentPhoto
   * @param {Element} photosContainer
   */
  Gallery.prototype.findClickedPhoto = function(currentPhoto, photosContainer) {
    var currPhoto = [].indexOf.call(photosContainer, currentPhoto.parentNode);
    this.setCurrentPhoto(currPhoto);
  };

  return Gallery;
});
