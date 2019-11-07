class GameObject extends Serializable {
  constructor(x, y, dimension = new Dimension(0, 0)) {
    super();
    this.position = createVector(x, y);
    this.dimension = dimension;

    this.children = [];
    this.parent;
  }

  addChild(node) {
    this.children.push(node);
    node.parent = this;

    /* Quickfix to collision detect sockets and inventoryItems 
      Could check children of colliding "main" but sockets migth be outside of the "main"
    */
    if (node instanceof Socket || node instanceof InventoryItem) collisionNodes.push(node);

    return node;
  }

  /*
  removeFromParent()
  removeAllChildren()
  */

  isColliding(point) {
    if (this.position.dist(point) < 1) return true;
    return false;
  }

  isCollidingRect(point) {

    if (this.parent != null) {
      point = point.copy().sub(this.parent.getGlobalPosition());
    }

    /* If rectMode is set to CENTER */
    /* if (rectMode()._renderer._rectMode = 'center') {
      if ( point.x > this.position.x - this.dimension.width * 0.5
        && point.x < this.position.x + this.dimension.width * 0.5
        && point.y > this.position.y - this.dimension.height * 0.5
        && point.y < this.position.y + this.dimension.height * 0.5) {
          return this;
      }
    } else { */
      if ( point.x > this.position.x
        && point.x < this.position.x + this.dimension.width
        && point.y > this.position.y
        && point.y < this.position.y + this.dimension.height) {
          return this;
      //}
    }
    return null;
  }

  /* Converts from local to global position */
  getGlobalPosition() {
    if (this.parent != null) {
      return this.parent.getGlobalPosition().add(this.position.copy());
    }
    return this.position.copy();
  }

  canManualRemove() { return true; }

  remove() { if(world.gameObjects.indexOf(this) != -1) world.gameObjects.splice(world.gameObjects.indexOf(this), 1); }
  
  draw() {}
  update() {}

  gameDraw() {
    push();
    translate(this.position.x, this.position.y);
    this.draw();
    this.children.forEach((child) => {
      child.gameDraw();
    });
    pop();
  }

  gameUpdate() {
    this.update();
    this.children.forEach((child) => {
      child.gameUpdate();
    });
  }
}

class InteractAble extends GameObject {
  constructor(x, y, dimension) {
    super(x, y, dimension);
    this.mouseIsOver = false;
    this.mouseIsPressed = false;
    this.hasFocus = false;
  }

  mouseReleased() {}
  mouseClicked() {}
  mousePressed() {}
}

class Dimension {
  constructor(w, h) {
    this.width = w;
    this.height = h;
  }
}


