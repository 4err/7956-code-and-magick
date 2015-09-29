"use stirct";

(function() {

  var demo_container = document.querySelector(".demo");

  Game.initialize();

  var wizard = new Wizard();

  Game.addEntity(wizard);

    window.onkeydown = function(event) {

      if (event.keyCode == 39) {
        wizard.moveTo('right');
      }

      if (event.keyCode == 37) {
        wizard.moveTo('left');
      }
    };

    window.onkeyup = function(event) {
      if (event.keyCode == 38) {
        wizard.jump();
      }
    }

//  window.onkeydown = throttle(function (event) {
//    if (event.keyCode == 38) {
//        wizard.jump();
//      }
//        if (event.keyCode == 39) {
//          wizard.moveTo('right');
//        }
//}, 10);

//  function throttle(fn, threshhold, scope) {
//  threshhold || (threshhold = 250);
//  var last,
//      deferTimer;
//  return function () {
//    var context = scope || this;
//
//    var now = +new Date,
//        args = arguments;
//    if (last && now < last + threshhold) {
//      // hold on to it
//      clearTimeout(deferTimer);
//      deferTimer = setTimeout(function () {
//        last = now;
//        fn.apply(context, args);
//      }, threshhold);
//    } else {
//      last = now;
//      fn.apply(context, args);
//    }
//  };
//}

  Game.run = (function() {
    var loops = 0,
      skipTicks = 1000 / Game.fps,
      maxFrameSkip = 10,
      nextGameTick = (new Date).getTime();

    return function() {
      loops = 0;

      while ((new Date).getTime() > nextGameTick) {
        Game.update();
        nextGameTick += skipTicks;
        loops++;
      }

      Game.draw();
    };
  })();

  (function() {
    var onEachFrame;
    if (window.RequestAnimationFrame) {
      onEachFrame = function(cb) {
        var _cb = function() {
          cb();
          webkitRequestAnimationFrame(_cb);
        }
        _cb();
      };
    } else {
      onEachFrame = function(cb) {
        setInterval(cb, 1000 / 60);
      }
    }

    window.onEachFrame = onEachFrame;
  })();

  window.onEachFrame(Game.run);

})();
