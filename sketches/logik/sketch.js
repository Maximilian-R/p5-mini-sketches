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
  // new LogicXor(700, 300);
  // new LogicBattery(100, 300);
  // new LogicBattery(500, 500);
  // new LogicNot(700, 500);
  // new LogicSelector(500, 100);
  // new LogicTimer(300, 100);
  // new LogicCounter(100, 100);
  //
  // new Light(800, 300);
  // new Light(700, 50);
  // new Light(700, 100);
  // new Light(700, 150);
}


class WorldNode {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.children = [];
    this.parent = null;
    worldNodes.push(this); // this could be like spritekit,
    // instead create node, than call addtoscene or add as child.
  }

  //children nodes should node be part of world nodes.
  // when parent node is updated and drawed, it should call for
  // its children.
  addChild(node) {
    worldNodes.splice(worldNodes.indexOf(node), 1);
    this.children.push(node);
    node.parent = this;
    return node;
  }
  /*
  removeFromParent()
  removeAllChildren()
  this.parent
  */
  isColliding(point) {
    if (this.pos.dist(point) < 1) return true;
    return false;
  }

  existNodeAtPoint(mouse) {
    if (!this.isColliding(mouse)) {
      return null;
    }
    var offsetMouse = mouse.copy().sub(this.pos);
    for (var j = 0; j < this.children.length; j++) {
      var child = this.children[j].existNodeAtPoint(offsetMouse);
      if (child != null) {
        return child;
      }
    }
    return this;
  }

  getGlobalPosition() {
    if (this.parent != null) {
      return this.parent.getGlobalPosition().add(this.pos.copy());
    }
    return this.pos.copy();
  }

  canManualRemove() { return true; }
  remove() { worldNodes.splice(worldNodes.indexOf(this), 1); }
  draw() {
    push();
    translate(this.pos.x, this.pos.y);
    for (var i = 0; i < this.children.length; i++) {
      this.children[i].draw();
    }
    pop();
  }
  update() {
    for (var i = 0; i < this.children.length; i++) {
      this.children[i].update();
    }
  }
}

class InteractAble extends WorldNode {
  constructor(x, y) {
    super(x, y);

    this.mouseIsOver = false;
    this.mouseIsPressed = false;
    this.mouseWasClicked = false;
  }
}
