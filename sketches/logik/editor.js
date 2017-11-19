function mouseClicked() {
  editor.mouseClicked();
}

class Editor {
  constructor() {
    this.mouse;
    this.outputSocket;
    this.hoverSocket;
  }

  mouseClicked() {

    //Check if socket was clicked
    for (var i = 0; i < sockets.length; i++) {
      var socket = sockets[i];
      if (socket.pos.dist(this.mouse) < socket.width) {
        // Select from socket or create connection
        if (this.outputSocket == null && socket instanceof OutputSocket) {
          this.outputSocket = socket;
        } else if (this.outputSocket != null && socket instanceof InputSocket &&
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
