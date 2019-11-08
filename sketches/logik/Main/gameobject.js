class GameObject extends Serializable {
  constructor(x, y) {
    super();
    this.position = createVector(x, y);

    this.children = [];
    this.parent;
  }

  addChild(node) {
    this.children.push(node);
    node.parent = this;
    return node;
  }

  /*
  removeFromParent()
  removeAllChildren()
  */

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

// Interactable
// hovered, clicked, released, pressed, 

// Drag&Drop
// has a [] of all gameobjects, modifies the gameojbect position
// gameobject know nothing about this

// Editor 

// Each gameobject that should be interactable/drag&drop must have a collider.

// Gameobject know nothing aboud interactable, color is set from an editor? 

class ColliderBox {
  constructor(gameObject, dimension) {
    this.gameObject = gameObject;
    this.dimension = dimension;

    collisionNodes.push(this);
  }

  get position() {
    return this.gameObject.getGlobalPosition();
  }

  isCollidingTemp(point) { //isCollidingPoint
    return this.position.dist(point) < this.dimension.width
        && this.position.dist(point) < this.dimension.height;
  }

  isColliding(point) {  
    // Issue: keep switching between center and corner...
    // rectMode()._renderer._rectMode = 'center'
    if (false) { 
      if ( point.x > this.position.x - this.dimension.width * 0.5
        && point.x < this.position.x + this.dimension.width * 0.5
        && point.y > this.position.y - this.dimension.height * 0.5
        && point.y < this.position.y + this.dimension.height * 0.5) {
          return this;
      }
    } else {
      if ( point.x > this.position.x
        && point.x < this.position.x + this.dimension.width
        && point.y > this.position.y
        && point.y < this.position.y + this.dimension.height) {
          return this;
      }
    }
    return null;
  }

}

class Dimension {
  constructor(w, h) {
    this.width = w;
    this.height = h;
  }
}


