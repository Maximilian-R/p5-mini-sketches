class Node extends Serializable {
  constructor(x, y) {
    super();
    this.pos = createVector(x, y);
    this.width = 0;
    this.height = 0;

    this.children = [];
    this.parent = null;
  }

  /*
  Should be a function of a class something like a SKScene...
  */
  static addToWorld(node) {
    worldNodes.push(node);
    /* Worldnodes are by default detected by collision */
    collisionNodes.push(node);
    return node;
  }

  addChild(node) {
    this.children.push(node);
    node.parent = this;

    /* Quickfix to collision detect sockets and inventoryItems */
    if (node instanceof Socket || node instanceof InventoryItem) collisionNodes.push(node);

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

    if (this.parent != null) {
      point = point.copy().sub(this.parent.getGlobalPosition());
    }

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
