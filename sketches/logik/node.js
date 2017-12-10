class Node extends Serializable {
  constructor(x, y) {
    super();
    this.pos = createVector(x, y);
    this.width = 0;
    this.height = 0;

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

  isCollidingRect(point) {
    /* If rectMode is set to CENTER */
    if (rectMode()._renderer._rectMode = 'center') {
      if ( point.x > this.pos.x - this.width * 0.5
        && point.x < this.pos.x + this.width * 0.5
        && point.y > this.pos.y - this.height * 0.5
        && point.y < this.pos.y + this.height * 0.5) {
          return this;
      }
    } else {
      if ( point.x > this.pos.x
        && point.x < this.pos.x + this.width
        && point.y > this.pos.y
        && point.y < this.pos.y + this.height) {
          return this;
      }
    }
    return null;
  }

  /* Return deepest child at given position */
  existNodeAtPoint(mouse) {
    if (!this.isCollidingRect(mouse)) {
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
    this.hasFocus = false;
  }

  mouseReleased() {}
  mouseClicked() {}
  mousePressed() {}
}
