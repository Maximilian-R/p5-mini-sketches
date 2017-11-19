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
    this.dragLogic;
  }

  keyPressed() {
    if (keyCode == 8) {
      // cancel palcement of connection
      this.outputSocket = null;
    }
  }

  mousePressed() {
    //Check if logic was clicked
    for (var i = 0; i < logics.length; i++) {
      var logic = logics[i];
      //this shoudl really use rect detection
      if (logic.pos.dist(this.mouse) < 20) {
        this.dragLogic = logic;
      }
    }
  }

  mouseReleased() {
    this.dragLogic = null;
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

    if (this.dragLogic != null) {
      this.dragLogic.pos = this.mouse;
      this.dragLogic.positionSockets();
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

    // Check if hovering logic and draw
    for (var i = 0; i < logics.length; i++) {
      var logic = logics[i];
      if (logic.pos.dist(this.mouse) < 20) {
        stroke(color(112, 2, 124));
        strokeWeight(logic.frameWidth);
        noFill();
        rect(logic.pos.x, logic.pos.y, logic.width, logic.height);
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
