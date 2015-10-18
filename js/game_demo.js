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

  function throttle(fn, timeout) {
    var last = 0;
    var timer = 0;
    var handler = function() {
      timer = 0;
      last = Date.now();
      fn.apply(null, arguments);
    };

    return function() {
      var args = arguments;
      var now = Date.now();
      if (now > last + timeout) {
        handler.apply(null, args);
      } else if (!timer) {
        timer = setTimeout(function() {
          handler.apply(null, args);
        }, last + timeout - now);
      }
    };
  }

  var checkVisibleCloudsThrottled = throttle(checkVisibleClouds, 100);

  window.addEventListener('scroll', function() {
    if (cloudsVisibility) {
      clouds.style.backgroundPositionX = document.body.scrollTop / 2 + 'px';
    }

    checkVisibleCloudsThrottled();
  });

  window.addEventListener('cloudsHidden', function() {
    cloudsVisibility = false;
  });

  window.addEventListener('cloudsShow', function() {
    cloudsVisibility = true;
  });

})();
