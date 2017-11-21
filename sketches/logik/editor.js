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
      if(this.clickedNode != null) {
        this.clickedNode.remove();
        this.clickeNode = null;
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

    this.dragNode.startDrag();
  }

  mouseReleased() {
    if(this.dragNode == null) {
      return
    }

    this.dragNode.drop();

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
    for (var i = 0; i < worldNodes.length; i++) {
      var node = worldNodes[i];
      if (node.canSelect() && node.isColliding(this.mouse)) {
        clickedNode = node;
        this.clickedNode = node;
        break;
      }
    }
    if (clickedNode == null) {
      this.clickedNode = null;
    }
}

  update() {
    this.mouse = createVector(mouseX, mouseY);

    // Check what mouse is hovering on, start or end hover
    var newHover = null;
    for (var i = 0; i < worldNodes.length; i++) {
      var node = worldNodes[i];
      //TODO: Rect detection
      if (node.pos.dist(this.mouse) < 20) {
        newHover = node;
        newHover.startHover();
        break;
      }
    }
    if(this.hoverNode == null) {
      this.hoverNode = newHover;
    } else if(newHover != this.hoverNode) {
      this.hoverNode.endHover();
      this.hoverNode = newHover;
    }


    if (this.dragNode != null) {
      this.dragNode.pos = this.mouse;
      this.dragNode.drag();
    }

  }

  draw() {

    // Check if hovering socket and draw
    for (var i = 0; i < sockets.length; i++) {
      var socket = sockets[i];
      if (socket.pos.dist(this.mouse) < socket.width) {
        strokeWeight(2);
        noFill();
        if((this.outputSocket == null && socket instanceof InputSocket)
        || (this.outputSocket != null && socket instanceof OutputSocket)
        || !socket.canEstablishConnection()) {
          stroke(200, 0, 0);
        } else {
          stroke(0, 200, 0);
        }
        rect(socket.pos.x, socket.pos.y, socket.width, socket.height);
        break;
      }
    }

    // Temporary Connection Draw
    if (this.outputSocket != null) {
      strokeWeight(6);
      stroke(0, 100, 0);
      noFill();
      line(this.outputSocket.pos.x, this.outputSocket.pos.y, mouseX, mouseY);
    }
  }

}
