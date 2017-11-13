var boxes = [];
var cam;
const PI = 3.14;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  cam = new navCamera();

  var w = 120;
  var d = 120;
  boxes.push(new volumeBox(-300, 0, floor(random(100, 600)), w, d, 0, 255, 0));
  boxes.push(new volumeBox(-100, 0, floor(random(100, 600)), w, d, 255, 0, 0));
  boxes.push(new volumeBox(100, 0, floor(random(100, 600)), w, d, 0, 0, 255));
  boxes.push(new volumeBox(300, 0, floor(random(100, 600)), w, d, 255, 255, 0));
}

function draw() {
  cam.update();
  background(255);

  boxes.forEach(function(b) {
    b.update();
  });
}

function mouseWheel() {
  cam.onMouseWheel(event);
}

function mouseReleased() {
  cam.onMouseRelease();
}

function mousePressed() {
  cam.onMousePress();
}
