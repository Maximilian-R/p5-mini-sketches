/* ------------ Give Mousehandler controll of all input functions ----------- */

function mouseClicked() { mouseHandler.mouseClicked(); }
function mousePressed() { mouseHandler.mousePressed(); }
function mouseReleased() { mouseHandler.mouseReleased(); }
function mouseDragged() { mouseHandler.mouseDragged(); }
function mouseMoved() { mouseHandler.mouseMoved(); }
function keyPressed() { mouseHandler.keyPressed(); }
function keyReleased() { mouseHandler.keyReleased(); }

/* -------------------------------------------------------------------------- */

class Subscribe {
  constructor() {
    this.subscribers = [];
  }

  subscribe(subscriber) {
    this.subscribers.push(subscriber);
  }
}


class MouseHandler extends Subscribe {
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
      this.nodesClicked[i].hasFocus = false;
    }
    this.nodesClicked = [];

    // Give focus from this click
    for (var i = 0; i < this.nodesAtMouse.length; i++) {
      this.nodesAtMouse[i].hasFocus = true;
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
      this.nodesAtMouse[i].mouseIsOver = false;
    }
    this.nodesAtMouse = [];

    // Handle this moved nodes
    for (var i = 0; i < worldNodes.length; i++) {
      var node = worldNodes[i].existNodeAtPoint(this.mouse);
      if (node != null) {
        this.nodesAtMouse.push(node);
        node.mouseIsOver = true;
      }
    }
  }

  update() {
    this.mouse.x = mouseX;
    this.mouse.y = mouseY;
  }

  /* Key Input */
    keyPressed() {
      this.pressedKey = keyCode;
      // for (var i = 0; i < this.subscribers.length; i++) {
      //   this.subscribers[i].keyPressed();
      // }
    }

    keyReleased() {
      this.pressedKey = null;
      // for (var i = 0; i < this.subscribers.length; i++) {
      //   this.subscribers[i].keyReleased();
      // }
    }
}

class DragAndDrop {
  constructor() {
    this.node;
    this.offset = createVector(0, 0);
  }

  mousePressed(nodes) {
    //select node
    if (nodes[0] == null || nodes[0].parent != null) return
    this.node = nodes[0];
    this.offset = createVector(this.node.getGlobalPosition().x - mouseX,
      this.node.getGlobalPosition().y - mouseY);
  }

  mouseDragged() {
    if (this.node == null) return
    this.node.pos = createVector(mouseX, mouseY).add(this.offset);
  }

  mouseReleased() {
    if (this.node == null) return
    this.node = null;
  }

  mouseMoved() {}
  mouseClicked() {}
}
