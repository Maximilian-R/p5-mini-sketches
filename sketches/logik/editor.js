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
    this.hoverSocket;
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
      if (logic.pos.dist(this.mouse) < 10) {
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

      if (socket.pos.dist(this.mouse) < socket.width / 2) {
        // Select from socket or create connection

        // select output
        if (this.outputSocket == null && socket instanceof OutputSocket) {
          this.outputSocket = socket;
        }

        //delete connection, create new
        else if (this.outputSocket == null && socket instanceof InputSocket) {
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

    this.hoverSocket = null;
    for (var i = 0; i < sockets.length; i++) {
      var socket = sockets[i];
      if (socket.pos.dist(this.mouse) < socket.width) {
        this.hoverSocket = socket;
        break;
      }
    }

    if (this.dragLogic != null) {
      this.dragLogic.pos = this.mouse;
      this.dragLogic.positionSockets();
    }

  }

  draw() {

    if(this.hoverSocket != null) {
      strokeWeight(2);

      if((this.outputSocket == null && this.hoverSocket instanceof InputSocket)
      || (this.outputSocket != null && this.hoverSocket instanceof OutputSocket)
      || !this.hoverSocket.canEstablishConnection()) {
        stroke(200, 0, 0);
      } else {
        stroke(0, 200, 0);
      }

      noFill();
      rect(this.hoverSocket.pos.x, this.hoverSocket.pos.y,
      this.hoverSocket.width, this.hoverSocket.height);
    }

    if (this.outputSocket != null) {
      strokeWeight(6);
      stroke(0, 100, 0);
      noFill();
      line(this.outputSocket.pos.x, this.outputSocket.pos.y, mouseX, mouseY);
    }
  }

}
