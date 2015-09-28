"use stirct";

(function () {

  var demo_container = document.querySelector(".demo");

  Game.initialize();
  Game.addWizard();
  Game.run = (function () {
    var loops = 0,
      skipTicks = 1000 / Game.fps,
      maxFrameSkip = 10,
      nextGameTick = (new Date).getTime();

    return function () {
      loops = 0;

      while ((new Date).getTime() > nextGameTick) {
        Game.update();
        nextGameTick += skipTicks;
        loops++;
      }

      Game.draw();
    };
  })();

  (function () {
    var onEachFrame;
    if (window.RequestAnimationFrame) {
      onEachFrame = function (cb) {
        var _cb = function () {
          cb();
          webkitRequestAnimationFrame(_cb);
        }
        _cb();
      };
    } else {
      onEachFrame = function (cb) {
        setInterval(cb, 1000 / 60);
      }
    }

    window.onEachFrame = onEachFrame;
  })();

  window.onEachFrame(Game.run);

})();