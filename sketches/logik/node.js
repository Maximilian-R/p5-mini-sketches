class Node {
  constructor(x, y) {
    this.pos = createVector(x, y);

    this.children = [];
    this.parent = null;
    worldNodes.push(this);
    /* This should behave like SpriteKit. Create a node, then call addToScene()
    When Implmented, remove splice on worldnodes from addchild function  */
  }

  addChild(node) {
    worldNodes.splice(worldNodes.indexOf(node), 1);
    this.children.push(node);
    node.parent = this;
    return node;
  }
  /*
  removeFromParent()
  removeAllChildren()
  */

  isColliding(point) {
    if (this.pos.dist(point) < 1) return true;
    return false;
  }

  /* Return deepest child at given position */
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

  /* Converts from local to global position */
  getGlobalPosition() {
    if (this.parent != null) {
      return this.parent.getGlobalPosition().add(this.pos.copy());
    }
    return this.pos.copy();
  }

  canManualRemove() { return true; }

  remove() { if(worldNodes.indexOf(this) != -1) worldNodes.splice(worldNodes.indexOf(this), 1); }

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

class InteractAble extends Node {
  constructor(x, y) {
    super(x, y);
    this.mouseIsOver = false;
    this.mouseIsPressed = false;
    this.mouseWasClicked = false;
    mouseHandler.subscribe(this);
  }

  mouseReleased() {}
  mouseClicked() {}
  mousePressed() {}
  select() {}
  deselect() {}
}
