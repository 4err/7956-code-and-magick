"use stirct";

function Wizard() {
  this.w = 93;
  this.h = 90;
  this.speed = 3;
  this.image = new Image();
  this.image.src = "../img/wizard.png";
  this.direction = "right";
  this.x = 0;
  this.y = Game.field.height - this.h;
  this.mass = 5;
  this.jumpHeight = 80;
  this.leftBorder = 0;
  this.rightBorder = Game.field.width - this.w;
  this.floor = Game.field.height - this.h;
}

Wizard.prototype.draw = function(context) {
  if (this.direction == "right") {
    context.drawImage(
      this.image,
      0,
      0,
      this.w,
      this.h,
      this.x,
      this.y,
      this.w,
      this.h);
  } else {
    context.drawImage(
      this.image,
      0 + this.w,
      0,
      this.w,
      this.h,
      this.x,
      this.y,
      this.w,
      this.h);
  }
}

Wizard.prototype.checkGravitation = function() {

  if (this.y < this.floor) {
    this.y += this.mass;
  }
}

Wizard.prototype.moveTo = function(direction) {
  switch (direction) {
    case 'right':
      this.direction = 'right';
      if (this.x < this.rightBorder) {
        this.x += this.speed;
      }
      break;
    case 'left':
      this.direction = 'left';
      if (this.x > this.leftBorder) {
        this.x -= this.speed;
      }
  }
}

Wizard.prototype.jump = function() {
  if (this.y == this.floor) {
    this.y -= this.jumpHeight;
  }
}

Wizard.prototype.update = function() {
  this.checkGravitation();
}
