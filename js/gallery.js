/*global
    GalleryPicture: true
    GalleryVideo: true*/

'use strict';

define([
  'views/photo',
  'views/video'
], function(GalleryPicture, GalleryVideo) {

  var Key = {
    'ESC': 27,
    'LEFT': 37,
    'RIGHT': 39
  };

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  var Gallery = function() {
    this._galleryOverlay = document.querySelector('.overlay-gallery');
    this._closeButton = this._galleryOverlay.querySelector('.overlay-gallery-close');
    this._leftButton = this._galleryOverlay.querySelector('.overlay-gallery-control-left');
    this._rightButton = this._galleryOverlay.querySelector('.overlay-gallery-control-right');
    this._pictureElement = this._galleryOverlay.querySelector('.overlay-gallery-preview');

    this._currentPhoto = 0;
    this._photos = new Backbone.Collection();

    this._onCloseClick = this._onCloseClick.bind(this);
    this._onLeftButtonClick = this._onLeftButtonClick.bind(this);
    this._onRightButtonClick = this._onRightButtonClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
  };

  Gallery.prototype.showGallery = function() {
    this._galleryOverlay.classList.remove('invisible');
    this._closeButton.addEventListener('click', this._onCloseClick);
    this._leftButton.addEventListener('click', this._onLeftButtonClick);
    this._rightButton.addEventListener('click', this._onRightButtonClick);
    document.body.addEventListener('keydown', this._onKeyDown);
  };

  Gallery.prototype.hideGallery = function() {
    this._galleryOverlay.classList.add('invisible');
    this._closeButton.removeEventListener('click', this._onCloseClick);
    this._leftButton.removeEventListener('click', this._onLeftButtonClick);
    this._rightButton.removeEventListener('click', this._onRightButtonClickn);
    document.body.removeEventListener('keydown', this._onKeyDown);

    this._currentPhoto = 0;
  };

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

  Gallery.prototype._onCloseClick = function(event) {
    event.preventDefault();
    this.hideGallery();
  };

  Gallery.prototype._onLeftButtonClick = function(event) {
    event.preventDefault();
    this._showPrevImage();
  };

  Gallery.prototype._onRightButtonClick = function(event) {
    event.preventDefault();
    this._showNextImage();
  };

  Gallery.prototype._showNextImage = function() {
    this.setCurrentPhoto(this._currentPhoto + 1);
  };

  Gallery.prototype._showPrevImage = function() {
    this.setCurrentPhoto(this._currentPhoto - 1);
  };

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

  Gallery.prototype.setPhotos = function(photos) {
    this._photos.reset(photos.map(function(photo) {
      return new Backbone.Model({
        url: photo.src,
        preview: photo.preview
      });
    }));
  };

  Gallery.prototype.setCurrentPhoto = function(num) {
    num = clamp(num, 0, this._photos.length - 1);

    this._currentPhoto = num;
    this.showCurrentPhoto();
  };

  Gallery.prototype.findClickedPhoto = function(currentPhoto, photosContainer) {
    var currPhoto = [].indexOf.call(photosContainer, currentPhoto.parentNode);
    this.setCurrentPhoto(currPhoto);
  };

  return Gallery;
});
