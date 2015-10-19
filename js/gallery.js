'use strict';

(function() {

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
    this._photos = [];

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

    this._photos = [];
    this._currentPhoto = 0;
  };

  Gallery.prototype.showCurrentPhoto = function() {
    this._pictureElement.innerHTML = '';

    var image = new Image();
    image.src = this._photos[this._currentPhoto];
    image.onload = function() {
      this._pictureElement.appendChild(image);
    }.bind(this);
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
    this._photos = photos;
  };

  Gallery.prototype.setCurrentPhoto = function(num) {
    num = clamp(num, 0, this._photos.length - 1);

    if (this._currentPhoto === num) {
      return;
    }

    this._currentPhoto = num;
    this.showCurrentPhoto();
  };

  window.Gallery = Gallery;

  var photoGalleryOverlay = new Gallery();
  var photoGallery = document.querySelector('.photogallery');
  var photosArray = document.querySelectorAll('.photogallery img');

  function fillGallery(currentPhoto) {
    var photos = [];
    var currPhoto = 0;
    for (var i = 0; i < photosArray.length; ++i) {
      photos.push(photosArray[i].src);
      if (photosArray[i].src === currentPhoto.src) {
        currPhoto = i;
      }
    }
    photoGalleryOverlay.setPhotos(photos);
    photoGalleryOverlay.setCurrentPhoto(currPhoto);
  }

  photoGallery.addEventListener('click', function(event) {
    event.preventDefault();
    if (event.target.tagName === 'IMG') {
      fillGallery(event.target);
      photoGalleryOverlay.showGallery();
    }
  });

})();
