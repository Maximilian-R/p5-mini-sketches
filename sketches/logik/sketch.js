var logics = [];
var sockets = [];
var connections = [];
var lights = [];
var editor;
var inventory;

var worldNodes = [];

function setup(){
  createCanvas(window.innerWidth, window.innerHeight);

  editor = new Editor();
  inventory = new Inventory(width, height);

  setupTestData();
}

function draw(){
  background(100);


  for (var i = 0; i < worldNodes.length; i++) {
    worldNodes[i].update();
    worldNodes[i].draw();
  }

  editor.update();
  editor.draw();

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


class WorldNode {
  constructor(x, y) {
    this.pos = createVector(x, y);
    worldNodes.push(this);
  }

  canSelect() { return true; }
  isColliding(point) {
    if (this.pos.dist(point) < 1) return true;
    return false;
  }
  didSelect() {}
  didUnSelect() {}
  draw() {}
  update() {}
  remove() { worldNodes.splice(worldNodes.indexOf(this), 1); }


/* Temporary */ 
  startDrag() {}
  drag() {}
  drop() {}
  startHover() {}
  endHover() {}
}

var nodes = [];
// TODO: this should be called interactable - and then make DragAndDropAble extends
// that. This way thing like socket can also be hovered
// should nodes still exists, or should they only be part of worldNodes
// and then check if it is or not?
class DragAndDropAble extends WorldNode {
  constructor(x, y) {
    super(x, y);
    nodes.push(this);
  }


}
