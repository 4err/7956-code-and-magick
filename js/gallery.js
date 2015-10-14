'use strict';

(function() {

  var Key = {
    'ESC': 27,
    'LEFT': 37,
    'RIGHT': 39
  };

  var photoGallery = document.querySelector('.photogallery');
  var galleryOverlay = document.querySelector('.overlay-gallery');
  var closeButton = galleryOverlay.querySelector('.overlay-gallery-close');
  var leftButton = galleryOverlay.querySelector('.overlay-gallery-control-left');
  var rightButton = galleryOverlay.querySelector('.overlay-gallery-control-right');

  function hideGallery() {
    galleryOverlay.classList.add('invisible');
    closeButton.removeEventListener('click', closeHandler);
    leftButton.removeEventListener('click', leftButtonHandler);
    rightButton.removeEventListener('click', rightButtonHandler);
    document.body.removeEventListener('keydown', keyHandler);
  }

  function showNextImage() {
    console.log('Show next image');
  }

  function showPrevImage() {
    console.log('Show prev image');
  }

  function closeHandler(evt) {
    evt.preventDefault();
    hideGallery();
  }

  function leftButtonHandler(evt) {
    evt.preventDefault();
    showPrevImage();
  }

  function rightButtonHandler(evt) {
    evt.preventDefault();
    showNextImage();
  }

  function showGallery() {
    galleryOverlay.classList.remove('invisible');
    closeButton.addEventListener('click', closeHandler);
    leftButton.addEventListener('click', leftButtonHandler);
    rightButton.addEventListener('click', rightButtonHandler);
    document.body.addEventListener('keydown', keyHandler);
  }

  photoGallery.addEventListener('click', function(evt) {
    evt.preventDefault();
    showGallery();
  });

  function keyHandler(evt) {
    switch (evt.keyCode) {
      case Key.LEFT:
        showPrevImage();
        break;
      case Key.RIGHT:
        showNextImage();
        break;
      case Key.ESC:
      default:
        hideGallery();
        break;
    }
  }
})();
