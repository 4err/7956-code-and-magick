'use strict';

(function () {

  var Key = {
    'ESC': 27,
    'LEFT': 37,
    'RIGHT': 39
  };

  var photogallery = document.querySelector('.photogallery');
  var galleryOverlay = document.querySelector('.overlay-gallery');
  var closeButton = galleryOverlay.querySelector('.overlay-gallery-close');
  var leftButton = galleryOverlay.querySelector('.overlay-gallery-control-left');
  var rightButton = galleryOverlay.querySelector('.overlay-gallery-control-right');

  function hideGallery() {
    galleryOverlay.classList.add('invisible');
    closeButton.removeEventListener('click');
    leftButton.removeEventListener('click');
    rightButton.removeEventListener('click');
    document.body.removeEventListener('keydown', keyHandler);
  }

  function showGallery() {
    galleryOverlay.classList.remove('invisible');

    closeButton.addEventListener('click', function (evt) {
      evt.preventDefault();
      hideGallery();
    });

    leftButton.addEventListener('click', function (evt) {
      evt.preventDefault();
      console.log('Left');
    });

    rightButton.addEventListener('click', function (evt) {
      evt.preventDefault();
      console.log('Right');
    });

    document.body.addEventListener('keydown', keyHandler);
  }


  photogallery.addEventListener('click', function (evt) {
    evt.preventDefault();
    showGallery();
  });

  function keyHandler(evt) {
    switch (evt.keyCode) {
      case Key.LEFT:
        console.log('Left');
        break;
      case Key.RIGHT:
        console.log('Right');
        break;
      case Key.ESC:
      default:
        hideGallery();
        break;
    }
  }
})();
