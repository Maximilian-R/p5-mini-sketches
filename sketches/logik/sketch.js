var logics = [];
var sockets = [];
var connections = [];
var lights = [];
var editor;
var inventory;

function setup(){
  createCanvas(window.innerWidth, window.innerHeight);

  editor = new Editor();
  inventory = new Inventory(width, height);

  setupTestData();
}

function draw(){
  background(100);

  for (var i = 0; i < connections.length; i++) {
    connections[i].draw();
  }
  for (var i = 0; i < logics.length; i++) {
    logics[i].update();
    logics[i].draw();
  }
  for (var i = 0; i < lights.length; i++) {
    lights[i].update();
    lights[i].draw();
  }

  editor.update();
  editor.draw();

  inventory.draw();

}

function setupTestData() {
  logics.push(new LogicOr(300, 300));
  logics.push(new LogicAnd(500, 300));
  logics.push(new LogicXor(700, 300));
  logics.push(new LogicBattery(100, 300));
  logics.push(new LogicBattery(500, 500));
  logics.push(new LogicNot(700, 500));
  logics.push(new LogicSelector(500, 100));
  logics.push(new LogicTimer(300, 100));
  logics.push(new LogicCounter(100, 100));

  lights.push(new Light(800, 300));
  lights.push(new Light(700, 50));
  lights.push(new Light(700, 100));
  lights.push(new Light(700, 150));


  var c1 = new Connection(logics[0].output[0], logics[1].inputs[0]);
  //var c2 = new Connection(logics[0].output[0], logics[1].inputs[1]);
  var c3 = new Connection(logics[1].output[0], logics[2].inputs[0]);
  var c4 = new Connection(logics[2].output[0], lights[0].input);
  var c3 = new Connection(logics[5].output[0], logics[2].inputs[1]);
  var b0 = new Connection(logics[3].output[0], logics[0].inputs[0]);
  var b1 = new Connection(logics[4].output[0], logics[1].inputs[1]);
  var l1 = new Connection(logics[6].output[0], lights[1].input);
  var l2 = new Connection(logics[6].output[1], lights[2].input);
  var l3 = new Connection(logics[6].output[2], lights[3].input);
}


class PlaceAble {
  constructor(x, y) {
    this.pos = createVector(x, y);
  }
}

var nodes = [];
// TODO: this should be called interactable - and then make DragAndDropAble extends
// that. This way thing like socket can also be hovered
class DragAndDropAble extends PlaceAble {
  constructor(x, y) {
    super(x, y);
    nodes.push(this);
  }

  startDrag() {}
  drag() {}
  drop() {}
  startHover() {}
  endHover() {}
}
