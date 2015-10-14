'use strict';

(function() {
  var clouds = document.querySelector('.header-clouds');
  var cloudsVisibility = true;
  clouds.style.backgroundPositionX = '50%';
  var left = 50;

  function checkVisibleClouds() {
    var cloudsVisiblePart = clouds.getBoundingClientRect().bottom;
    if (cloudsVisiblePart < 0) {
      window.dispatchEvent(new CustomEvent('cloudsHidden'));
    } else {
      window.dispatchEvent(new CustomEvent('cloudsShow'));
    }

  }

  var checkTimeout;

  window.addEventListener('scroll', function(evt) {
    console.log(evt);
    if (cloudsVisibility) {
      clouds.style.backgroundPositionX = left + 5 + '%';
      left += 5;
    }

    clearTimeout(checkTimeout);
    checkTimeout = setTimeout(checkVisibleClouds, 100);
  });

  window.addEventListener('cloudsHidden', function() {
    cloudsVisibility = false;
  });
  window.addEventListener('cloudsShow', function() {
    cloudsVisibility = true;
  });

})();
