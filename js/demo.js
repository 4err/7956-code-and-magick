"use stirct";

(function () {
  var demo_container = document.querySelector(".demo");
  var canvas = document.getElementById("demo");
  var ctx = canvas.getContext('2d');

  function move_object(object, x, y) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(object, x, y);
  }

  var wizard = new Image();
  wizard.src = "../img/wizard.gif";
  var wizard_data = {
    "x": 0,
    "y": 0,
    "speed": 3
  };

  wizard.onload = function () {
    wizard.style.height = "93px";
    wizard.style.width = "90px";
    wizard_data.y = (canvas.height - wizard.height);

    move_object(wizard, wizard_data.x, wizard_data.y);
  };

  window.addEventListener("keydown", function (event) {
    if (event.keyCode == 39) {
      if (wizard_data.x < canvas.width - wizard.width) {
        move_object(wizard, wizard_data.x += wizard_data.speed, wizard_data.y);
      }
    }

    if (event.keyCode == 37) {
      if (wizard_data.x > 0) {
        move_object(wizard, wizard_data.x -= wizard_data.speed, wizard_data.y);
      }
    }
  });

})();
