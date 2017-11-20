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
  }

  keyPressed() {
    if (keyCode == 8) {
      // cancel palcement of connection
      this.outputSocket = null;
    }
  }

  mousePressed() {
    if(this.hoverNode != null) {
      this.dragNode = this.hoverNode;
      this.dragNode.startDrag();
    }
  }

  mouseReleased() {
    if (this.dragNode != null) {
      this.dragNode.drop();
      this.dragNode = null;
    }
  }

  mouseClicked() {
    //Check if socket was clicked
    for (var i = 0; i < sockets.length; i++) {
      var socket = sockets[i];

      if (socket.pos.dist(this.mouse) < socket.width) {
        // Select from socket or create connection

        // select output
        if (this.outputSocket == null && socket instanceof OutputSocket) {
          this.outputSocket = socket;
        }

        //delete connection, create new
        else if (this.outputSocket == null && socket instanceof InputSocket
        && socket.connections[0] != null) {
          this.outputSocket = socket.connections[0].input;
          socket.connections[0].delete();
        }

        // connect to input
        else if (this.outputSocket != null && socket instanceof InputSocket &&
        socket.canEstablishConnection()) {
          var c1 = new Connection(this.outputSocket, socket);
          this.outputSocket = null;
        }

        break;
      }
    }
  }

  update() {
    this.mouse = createVector(mouseX, mouseY);

    // Check what mouse is hovering on, start or end hover
    var newHover = null;
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
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
