"use stirct";

  function Wizard() {
    this.w = 93;
    this.h = 90;
    this.speed = 3;
    this.image = new Image();
    this.image.src = "../img/wizard.gif";
    this.x = 0;
    this.y = Game.field.height - this.h;
  }

  Wizard.prototype.draw = function(context) {
    context.drawImage(this.image, this.x, this.y);
  }

  Wizard.prototype.update = function() {
    var This = this;

    window.onkeydown = function(event) {

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
