"use stirct";

(function () {

  var Game = {};
  Game.fps = 50;
  Game.initialize = function () {
    this.entities = [];
    this.field = document.getElementById("demo");
    this.context = this.field.getContext("2d");
  }

  Game.draw = function () {
    this.context.clearRect(0, 0, this.field.width, this.field.height);

    for (var i = 0; i < this.entities.length; i++) {
      this.entities[i].draw(this.context);
    }
  }

  Game.update = function () {
    for (var i = 0; i < this.entities.length; i++) {
      this.entities[i].update();
    }
  }

  Game.addWizard = function () {
    Game.entities.push(new Wizard());
  };

  function Wizard() {
    this.w = 93;
    this.h = 90;
    this.speed = 3;
    this.image = new Image();
    this.image.src = "../img/wizard.gif";
    this.x = 0;
    this.y = Game.field.height - this.h;
  }

  Wizard.prototype.draw = function (context) {
    context.drawImage(this.image, this.x, this.y);
  }

  Wizard.prototype.update = function () {
    var This = this;

    window.onkeydown = function (event) {

      if (event.keyCode == 39) {
        if (This.x < Game.field.width - This.w) {
          This.x += This.speed;
        }
      }

      if (event.keyCode == 37) {
        if (This.x > 0) {
          This.x -= This.speed;
        }
      }
    };
  }

  var demo_container = document.querySelector(".demo");
  //  var canvas = document.getElementById("demo");
  //  var ctx = canvas.getContext('2d');

  //  function move_object(object, x, y) {
  //    ctx.clearRect(0, 0, canvas.width, canvas.height);
  //    ctx.drawImage(object, x, y);
  //  }
  //
  //  var wizard = new Image();
  //  wizard.src = "../img/wizard.gif";
  //  var wizard_data = {
  //    "x": 0,
  //    "y": 0,
  //    "speed": 3
  //  };

  //  wizard.onload = function () {
  //    wizard.style.height = "93px";
  //    wizard.style.width = "90px";
  //    wizard_data.y = (canvas.height - wizard.height);
  //
  //    move_object(wizard, wizard_data.x, wizard_data.y);
  //  };

  //  window.addEventListener("keydown", function (event) {
  //    if (event.keyCode == 39) {
  //      if (wizard_data.x < canvas.width - wizard.width) {
  //        move_object(wizard, wizard_data.x += wizard_data.speed, wizard_data.y);
  //      }
  //    }
  //
  //    if (event.keyCode == 37) {
  //      if (wizard_data.x > 0) {
  //        move_object(wizard, wizard_data.x -= wizard_data.speed, wizard_data.y);
  //      }
  //    }
  //  });

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
