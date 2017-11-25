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


class MouseHandler {
  constructor() {
    this.nodesAtMouse = [];
    this.subscribers = [];
    this.mouse;
  }

  subscribe(subscriber) {
    this.subscribers.push(subscriber);
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
