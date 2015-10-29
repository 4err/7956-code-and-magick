'use strict';

define([
  'game'
],
  function(Game) {
    var clouds = document.querySelector('.header-clouds');
    var cloudsVisibility = true;
    clouds.style.backgroundPositionX = '50%';

    /**
     * Проверка видимости облаков на экране
     */
    function checkVisibleClouds() {
      var cloudsVisiblePart = clouds.getBoundingClientRect().bottom;
      if (cloudsVisiblePart < 0) {
        window.dispatchEvent(new CustomEvent('cloudsHidden'));
      } else {
        window.dispatchEvent(new CustomEvent('cloudsShow'));
      }
    }

    /**
     * Функция троттлинга
     * @param   {Function} fn
     * @param   {Number}   timeout
     * @returns {Function}
     */
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

    /**
     *  Затроттленая функция
     */
    var checkVisibleCloudsThrottled = throttle(checkVisibleClouds, 100);

    /**
     * Обработчик скролла
     */
    window.addEventListener('scroll', function() {
      if (cloudsVisibility) {
        window.requestAnimationFrame(function() {
          clouds.style.backgroundPositionX = document.body.scrollTop / 2 + 'px';
        });
        game.setGameStatus(Game.Verdict.CONTINUE);
      } else {
        game.setGameStatus(Game.Verdict.PAUSE);
      }

      checkVisibleCloudsThrottled();
    });

    /**
     * Обработчик скрытия облаков
     */
    window.addEventListener('cloudsHidden', function() {
      cloudsVisibility = false;
    });

    /**
     * Обработчик показа облаков
     */
    window.addEventListener('cloudsShow', function() {
      cloudsVisibility = true;
    });

    /**
     * Инициализация игры.
     */
    var game = new Game.Game(document.querySelector('.demo'));
    game.initializeLevelAndStart();
    game.setGameStatus(Game.Verdict.INTRO);
  });
