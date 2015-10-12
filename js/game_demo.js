'use strict';

(function () {
  var clouds = document.querySelector('.header-clouds');
  var cloudsVisibility = true;
  clouds.style.left = '0px';

  function checkVisibleClouds() {
    var cloudsVisiblePart = clouds.getBoundingClientRect().bottom;
    if (cloudsVisiblePart > 0) {
      window.dispatchEvent(new CustomEvent('cloudsHidden'));
    }
  }

  function initScroll() {
    var checkTimeout;
    window.addEventListener('scroll', function () {
      clearTimeout(checkTimeout);
      checkTimeout = setTimeout(checkVisibleClouds, 100);
    });

    window.addEventListener('cloudsHidden', function () {
      cloudsVisibility = false;
    });
  }

  window.addEventListener('scroll', function () {
    if (cloudsVisibility) {
      var oldLeft = parseInt(clouds.style.left, 10);
      clouds.style.left = oldLeft + 10 + 'px';
    }
  });
})();
