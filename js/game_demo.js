'use strict';

(function() {
  var clouds = document.querySelector('.header-clouds');
  clouds.style.left = '0px';

  window.addEventListener('scroll', function() {
    var cloudsVisiblePart = clouds.getBoundingClientRect().bottom;
    if (cloudsVisiblePart > 0) {
      var oldLeft = parseInt(clouds.style.left, 10);
      clouds.style.left = oldLeft + 10 + 'px';
    }
  });
})();
