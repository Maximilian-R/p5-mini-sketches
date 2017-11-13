var lines = [];
var grid;
var editLine;
var focusTrain;

function setup() {
  var ctx = createCanvas(window.innerWidth, window.innerHeight);
  rectMode(CENTER);

  grid = new Grid();

  editLine = new Line("DEMO line", color("#42f480"));
  lines.push(editLine);
  editLine.addStation(new Station(100, 200));
  editLine.addStation(new Station(300, 200));

  editLine.buildRail(editLine.getStation(0), editLine.getStation(1));

  focusTrain = editLine.enterTrain();
}

function draw() {
  background(240);
  strokeCap(ROUND);

  for (var i = 0; i < lines.length; i++) {
    lines[i].update();
  }

  grid.update();
}

function mousePressed() {
  grid.mouse.pressed();
}

function keyPressed() {
  if (keyCode == UP_ARROW) {
    grid.mouse = new TrackMouse();
  } else if (keyCode == DOWN_ARROW) {
    grid.mouse = new StationMouse();
  } else if (keyCode == LEFT_ARROW) {
    grid.mouse = new GridMouse();
  }
}
