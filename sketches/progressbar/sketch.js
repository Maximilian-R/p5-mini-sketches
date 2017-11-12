var clock;
var p1;
var p2;
var p3;

var debugOn = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  clock = new ProgressBarClock();
  p1 = new ProgressCircle("Test", 0, 100, width * 0.25, 500, color('#fc72a5'));
  p2 = new ProgressCircle("Test", 33.3, 100, width * 0.5, 500, color('#fc72a5'));
  p3 = new ProgressCircle("Test", 66.6, 100, width * 0.75, 500, color('#fc72a5'));
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(240);
  clock.update();
  p1.update();
  p2.update();
  p3.update();
}
