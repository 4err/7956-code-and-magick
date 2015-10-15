'use strict';

(function() {
  var clouds = document.querySelector('.header-clouds');
  var cloudsVisibility = true;
  clouds.style.backgroundPositionX = '50%';

  function checkVisibleClouds() {
    var cloudsVisiblePart = clouds.getBoundingClientRect().bottom;
    if (cloudsVisiblePart < 0) {
      window.dispatchEvent(new CustomEvent('cloudsHidden'));
    } else {
      window.dispatchEvent(new CustomEvent('cloudsShow'));
    }
  }
  var checkTimeout;
  function throttle(method, time) {
    clearTimeout(checkTimeout);
    checkTimeout = setTimeout(method, time);
  }

  window.addEventListener('scroll', function(evt) {
    if (cloudsVisibility) {
      clouds.style.backgroundPositionX = document.body.scrollTop + 'px';
    }

    throttle(checkVisibleClouds, 100);
  });

  window.addEventListener('cloudsHidden', function() {
    cloudsVisibility = false;
  });
  window.addEventListener('cloudsShow', function() {
    cloudsVisibility = true;
  });

})();
