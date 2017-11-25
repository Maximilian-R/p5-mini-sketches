function mouseClicked() {
  editor.mouseClicked();
  mouseHandler.mouseClicked();
}

function mousePressed() {
  editor.mousePressed();
  mouseHandler.mousePressed();
}

function mouseReleased() {
  editor.mouseReleased();
  mouseHandler.mouseReleased();
}

function keyPressed() {
  editor.keyPressed();
  mouseHandler.keyPressed();
}

function keyReleased() {
  mouseHandler.keyReleased();
}


class MouseHandler {
  constructor() {
    this.nodesAtMouse = [];
    this.subscribers = [];
    this.mouse;

    this.pressedKey;
  }

  subscribe(subscriber) {
    this.subscribers.push(subscriber);
  }

  keyPressed() {
    this.pressedKey = keyCode;
  }

  keyReleased() {
    this.pressedKey = null;
  }

  mouseClicked() {
    for (var i = 0; i < this.nodesAtMouse.length; i++) {
      this.nodesAtMouse[i].mouseClicked();
    }
  }

  mousePressed() {
    this.mouse = createVector(mouseX, mouseY);

    for (var i = 0; i < this.subscribers.length; i++) {
      var node = this.subscribers[i].existNodeAtPoint(this.mouse);
      if (node != null) {
        this.nodesAtMouse.push(node);
      }
    }

    for (var i = 0; i < this.nodesAtMouse.length; i++) {
      this.nodesAtMouse[i].mousePressed();
    }
  }

  mouseReleased() {
    for (var i = 0; i < this.nodesAtMouse.length; i++) {
      this.nodesAtMouse[i].mouseReleased();
    }

    this.nodesAtMouse = [];
  }
}
