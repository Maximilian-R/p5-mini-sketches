function mouseClicked() {
  editor.mouseClicked();
}

function mousePressed() {
  editor.mousePressed();
}

function mouseReleased() {
  editor.mouseReleased();
}

function keyPressed() {
  editor.keyPressed();
}

class Editor {
  constructor() {
    this.mouse;
    this.outputSocket;
    this.dragNode;
    this.hoverNode;
    this.clickedNode;
  }

  keyPressed() {
    if (keyCode == 8) {
      // cancel palcement of connection
      this.outputSocket = null;
      if(this.clickedNode != null && this.clickedNode.canManualRemove()) {
        this.clickedNode.remove();
        this.clickedNode = null;
      }
    }
  }


  /* Change to drag and drop functionality

  If hovering on output socket and press mouse,
    create connection with output.
    if connection is missing an input, have a temp pos.
  Drag -> update temp position.
  If Release on nothing, delete connection.
  Else if relese on inputSocket add socket to connection.

  */

  mousePressed() {
    if(this.hoverNode == null) {
      return
    }
    this.dragNode = this.hoverNode;

    // Create new Connection
    if (this.hoverNode instanceof OutputSocket) {
      var connection = new Connection(this.hoverNode);
      this.dragNode = connection;
    }

    // Create new Connection
    if (this.hoverNode instanceof InputSocket && this.hoverNode.hasConnection()) {
      // Disconnect from inputoscket
      var connection = this.hoverNode.connections.pop();
      this.dragNode = connection;
      this.dragNode.output = null;

    }

    this.dragNode.mouseIsPressed = true;
  }

  mouseReleased() {
    if(this.dragNode == null) {
      return
    }

    //this.dragNode.drop();
    this.dragNode.mouseIsPressed = false;

    // create or delete temp connection
    if (this.dragNode instanceof Connection) {
      if(this.hoverNode instanceof InputSocket) {
        this.dragNode.setOutput(this.hoverNode);
      } else {
        this.dragNode.remove();
      }
    }

    this.dragNode = null;
  }

  mouseClicked() {

    var clickedNode = null;
    if (this.hoverNode != null) { //&& this.hoverNode.canSelect()
      if(this.clickedNode != null) {
        this.clickedNode.mouseWasClicked = false;
      }
      clickedNode = this.hoverNode;
      this.clickedNode = clickedNode;
      this.clickedNode.mouseWasClicked = true;
    }
    if (clickedNode == null && this.clickedNode != null) {
      this.clickedNode.mouseWasClicked = false;
      this.clickedNode = null;
    }
}

  update() {
    this.mouse = createVector(mouseX, mouseY);

    // Check what mouse is hovering on, start or end hover
    var newHover = null;
    for (var i = 0; i < worldNodes.length; i++) {
      var node = worldNodes[i].existNodeAtPoint(this.mouse);
      if (node != null) {
        newHover = node;
        newHover.mouseIsOver = true;
        break;
      }
    }
    if(this.hoverNode == null) {
      this.hoverNode = newHover;
    } else if(newHover != this.hoverNode) {
      this.hoverNode.mouseIsOver = false;
      this.hoverNode = newHover;
    }

    if (this.dragNode != null) {
      this.dragNode.pos = this.mouse;
    }
  }

  draw() {
  }

}
