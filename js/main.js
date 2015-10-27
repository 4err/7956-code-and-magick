'use strict';

requirejs.config({
  baseUrl: 'js'
});

define([
  'gallery',
  'form_validation',
  'form'
], function(Gallery) {
  var photoGalleryOverlay = new Gallery();
  var photoGallery = document.querySelector('.photogallery');
  var photosArray = document.querySelectorAll('.photogallery-image');
  var photos = [];

  for (var i = 0; i < photosArray.length; ++i) {
    var data = photosArray[i].dataset;
    var img = photosArray[i].querySelector('img');

    if (data['replacementVideo']) {
      photos.push({
        src: data['replacementVideo'],
        preview: img.src
      });
    } else {
      photos.push({
        src: img.src
      });
    }
  }

  photoGalleryOverlay.setPhotos(photos);

  photoGallery.addEventListener('click', function(event) {
    event.preventDefault();
    if (event.target.tagName === 'IMG') {
      photoGalleryOverlay.findClickedPhoto(event.target);
      photoGalleryOverlay.showGallery();
    }
  });
});
