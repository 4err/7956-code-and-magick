'use strict';

(function() {

  var Key = {
    'ESC': 27,
    'LEFT': 37,
    'RIGHT': 39
  };

  var Gallery = function() {
    this._galleryOverlay = document.querySelector('.overlay-gallery');
    this._closeButton = galleryOverlay.querySelector('.overlay-gallery-close');
    this._leftButton = galleryOverlay.querySelector('.overlay-gallery-control-left');
    this._rightButton = galleryOverlay.querySelector('.overlay-gallery-control-right');
    this._pictureElement = this._galleryOverlay.querySelector('.overlay-gallery-preview');

    this._currentPhoto = 0;
    this._photos = [];

    this._onCloseClick = this._onCloseClick.bind(this);
    this._onLeftButtonClick = this._onLeftButtonClick.bind(this);
    this._onRightButtonClick = this._onRightButtonClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
  }

  var photoGallery = document.querySelector('.photogallery');

  Gallery.prototype.showGallery = function() {
    this._galleryOverlay.classList.remove('invisible');
    this._closeButton.addEventListener('click', this._onCloseClick);
    this._leftButton.addEventListener('click', this._onLeftButtonClick);
    this._rightButton.addEventListener('click', this._onRightButtonClickn);
    document.body.addEventListener('keydown', this._onKeyDown);

    this._showCurrentPhoto();
  }

  Gallery.prototype.hideGallery = function() {
    this._galleryOverlay.classList.add('invisible');
    this._closeButton.removeEventListener('click', this._onCloseClick);
    this._leftButton.removeEventListener('click', this._onLeftButtonClick);
    this._rightButton.removeEventListener('click', this._onRightButtonClickn);
    document.body.removeEventListener('keydown', this._onKeyDown);

    this._photos = [];
    this._currentPhoto = 0;
  }

  Gallery.prototype.showCurrentPhoto = function() {
    this._pictureElement.innerHTML = '';

    var image = new Image();
    image.src = this._photos[this._currentPhoto];
    image.onload = function() {
      this._pictureElement.appendChild(image);
    }.bind(this);
  }

  Gallery.prototype._onCloseClick = function(event) {
    event.preventDefault();
    this.hideGallery();
  }

  Gallery.prototype._onLeftButtonClick = function(event) {
    event.preventDefault();
    showPrevImage();
  }

  Gallery.prototype._onRightButtonClick = function(event) {
    event.preventDefault();
    showNextImage();
  }

  function showNextImage() {
    console.log('Show next image');
  }

  function showPrevImage() {
    console.log('Show prev image');
  }

  photoGallery.addEventListener('click', function(evt) {
    evt.preventDefault();
    if (evt.target.tagName === 'IMG') {
      showGallery();
    }
  });

 Gallery.prototype._onKeyDown = function(event) {
    switch (event.keyCode) {
      case Key.LEFT:
        showPrevImage();
        break;
      case Key.RIGHT:
        showNextImage();
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

})();
