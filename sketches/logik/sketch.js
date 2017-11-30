var editor;
var inventory;
var mouseHandler;
var worldNodes = [];

function setup(){
  createCanvas(window.innerWidth, window.innerHeight);

  mouseHandler = new MouseHandler();
  mouseHandler.subscribe(new DragAndDrop());

  editor = new Editor();
  mouseHandler.subscribe(editor);

  inventory = new Inventory(width, height);

  setupTestData();
}

function draw(){
  background(220);

  for (var i = 0; i < worldNodes.length; i++) {
    worldNodes[i].update();
    worldNodes[i].draw();
  }
  mouseHandler.update();
  inventory.draw();
}

function setupTestData() {
  new LogicOr(300, 300);
  new LogicAnd(500, 300);
  new LogicXor(700, 300);
  new LogicBattery(100, 300);
  new LogicBattery(500, 500);
  new LogicNot(700, 500);
  new LogicSelector(500, 100);
  new LogicTimer(300, 100);
  new LogicCounter(100, 100);

  new Light(800, 300);
  new Light(700, 50);
  new Light(700, 100);
  new Light(700, 150);
}
