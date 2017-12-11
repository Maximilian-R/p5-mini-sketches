var editor;
var inventory;
var mouseHandler;
var worldNodes = [];
var collisionNodes = [];

function setup(){
  createCanvas(window.innerWidth, window.innerHeight);

  mouseHandler = new MouseHandler();
  mouseHandler.subscribe(new DragAndDrop());

  editor = new Editor();
  mouseHandler.subscribe(editor);

  loadPlayground();

  //setupTestData();

  classes = {
    "LogicOr" : LogicOr,
    "LogicAnd" : LogicAnd,
    "LogicNot" : LogicNot,
    "LogicXor" : LogicXor,
    "LogicBattery" : LogicBattery,
    "LogicTimer" : LogicTimer,
    "LogicCounter" : LogicCounter,
    "LogicSelector" : LogicSelector,
    "LogicSwitch" : LogicSwitch,
    "LogicSplitter" : LogicSplitter,
    "LogicCombiner" : LogicCombiner,
    "LogicKeyInput" : LogicKeyInput,
    "Light" : Light
  };
}

function draw(){
  background(220);

  for (var i = 0; i < worldNodes.length; i++) {
    worldNodes[i].update();
    worldNodes[i].draw();
  }
  mouseHandler.update();
  //inventory.draw();
}

function setupTestData() {
  Node.addToWorld(new LogicOr(300, 300));
  Node.addToWorld(new LogicAnd(500, 300));
  Node.addToWorld(new LogicXor(700, 300));
  Node.addToWorld(new LogicBattery(100, 300));
  Node.addToWorld(new LogicBattery(500, 500));
  Node.addToWorld(new LogicNot(700, 500));
  Node.addToWorld(new LogicSelector(500, 100));
  Node.addToWorld(new LogicTimer(300, 100));
  Node.addToWorld(new LogicCounter(100, 100));
  Node.addToWorld(new Light(800, 300));
  Node.addToWorld(new Light(700, 50));
  Node.addToWorld(new Light(700, 100));
  Node.addToWorld(new Light(700, 150));
}

function loadPlayground() {
  inventory = Node.addToWorld(new Inventory(width, height));
}

function resetPlayground() {

  for (var i = worldNodes.length - 1; i >= 0; i--) {
    worldNodes[i].remove();
  }

  worldNodes.push(inventory);
}
