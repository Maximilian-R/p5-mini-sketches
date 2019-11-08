/* ------------ Give Mouse/Keyboard-handler controll of all input functions ----------- */

function mouseClicked() { MouseHandler.mouseClicked(); }
function mousePressed() { MouseHandler.mousePressed(); }
function mouseReleased() { MouseHandler.mouseReleased(); }
function mouseDragged() { MouseHandler.mouseDragged(); }
function mouseMoved() { MouseHandler.mouseMoved(); }
function keyPressed() { KeyboardHandler.keyPressed(); }
function keyReleased() { KeyboardHandler.keyReleased(); }

function mouseWheel(event) {
  world.camera.scroll(event.deltaX, event.deltaY);
  world.editor.positionGrid();
}

class Subscribe {
  constructor() {
    this.subscribers = [];
  }

  subscribe(subscriber) {
    this.subscribers.push(subscriber);
  }
}

class KeyboardHandlerClass extends Subscribe {
  constructor() {
    super();
    this.pressedKeys = [];
  }

  /* Key Input */
  keyPressed() {
    this.pressedKeys.push(keyCode);

    for (var i = 0; i < this.subscribers.length; i++) {
      this.subscribers[i].keyPressed(keyCode);
    }
  }

  keyReleased() {
    this.pressedKeys.splice(this.pressedKeys.indexOf(keyCode), 1);
    // for (var i = 0; i < this.subscribers.length; i++) {
    //   this.subscribers[i].keyReleased();
    // }
  }

  isCharPressed(character) {
    var hasChar = false;
    for(var i = 0; i < this.pressedKeys.length; i++) {
      if (char(this.pressedKeys[i]) === character) {
        return true;
      }
    }
    return false;
  }
}


class MouseHandlerClass extends Subscribe {
  constructor() {
    super();
    this.mouse = createVector(0, 0);
    this.pressedKey;
    this.nodesAtMouse = [];
    this.nodesClicked = [];
  }

/* Mouse Input */

  mouseClicked() {
    // Remove focus from last click
    for (var i = 0; i < this.nodesClicked.length; i++) {
      this.nodesClicked[i].isHighlight = false;
    }
    this.nodesClicked = [];

    // Give focus from this click
    for (var i = 0; i < this.nodesAtMouse.length; i++) {
      this.nodesAtMouse[i].isHighlight = true;
      this.nodesClicked.push(this.nodesAtMouse[i]);
    }

    for (var i = 0; i < this.subscribers.length; i++) {
      this.subscribers[i].mouseClicked(this.nodesClicked);
    }
  }

  mousePressed() {
    for (var i = 0; i < this.subscribers.length; i++) {
      this.subscribers[i].mousePressed(this.nodesAtMouse);
    }
  }

  mouseReleased() {
    for (var i = 0; i < this.subscribers.length; i++) {
      this.subscribers[i].mouseReleased(this.nodesAtMouse);
    }
  }

  mouseDragged() {
    this.updateNodesAtMouse();

    for (var i = 0; i < this.subscribers.length; i++) {
      this.subscribers[i].mouseDragged();
    }
  }

  mouseMoved() {
    this.updateNodesAtMouse();

    for (var i = 0; i < this.subscribers.length; i++) {
      this.subscribers[i].mouseMoved(this.nodesAtMouse);
    }
  }

  /* Check nodes at mouse position and set their hover attribute */
  updateNodesAtMouse() {
    // Handle last moved nodes
    for (var i = 0; i < this.nodesAtMouse.length; i++) {
      // Editor or similar should be changing isHighlight...
      this.nodesAtMouse[i].isHighlight = false;
    }

    this.nodesAtMouse = [];
    let mouseInWorld = world.positionInWorld(this.mouse.copy());
    let colliders = CollisionHandler.collidingWith(mouseInWorld);
    for (var i = 0; i < colliders.length; i++) {
      let collider = colliders[i];
      this.nodesAtMouse.push(collider.gameObject);
      // Editor or similar should be changing isHighlight...
      collider.gameObject.isHighlight = true;
    }
  }

  update() {
    this.mouse.x = mouseX;
    this.mouse.y = mouseY;
  }
}

class DragAndDrop {
  constructor() {
    this.node;
    this.offset = createVector(0, 0);
  }

  mousePressed(nodes) {
    if (nodes[0] == null ||
      (nodes[0].parent != null && !(nodes[0] instanceof InventoryItem))) {
      return;
    }

    this.node = nodes[0];

    /* If it is a child node */
    if (this.node.parent != null) {
      this.offset = createVector(-this.node.parent.getGlobalPosition().x,
      -this.node.parent.getGlobalPosition().y);
    } else {
      this.offset = createVector(this.node.getGlobalPosition().x - mouseX,
      this.node.getGlobalPosition().y - mouseY);
    }
  }

  mouseDragged() {
    if (this.node == null) return
    this.node.position = world.editor.grid.snapToGrid(createVector(mouseX, mouseY).add(this.offset));
  }

  mouseReleased() {
    if (this.node == null) return
    this.node = null;
  }

  mouseMoved() {}
  mouseClicked() {}
  keyPressed() {}
}
