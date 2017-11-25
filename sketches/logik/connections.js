class Socket extends InteractAble {
  constructor(x, y) {
    super(x, y);
    this.color = color(50);
    this.strokeColor;
    this.width = 10;
    this.height = 10;
    this.power = 0;
    this.connections = [];
  }

  isColliding(point) {
    if (this.pos.dist(point) < this.width) return true;
    return false;
  }

  canManualRemove() { return false; }

  remove() {
    for (var i = this.connections.length - 1; i >= 0; i--) {
      this.connections[i].remove();
    }
    super.remove();
  }

  /* Check if any power is applied */
  isOn() { return this.power != 0; }
  /* Check if a connection can be added */
  canEstablishConnection() { return true; }
  /* Add a connection */
  connect(connection) {}

  update() {
    super.update();
  }

  draw() {
    super.draw();
    push();
    translate(this.pos.x, this.pos.y);
    if (this.strokeColor) {
      strokeWeight(2);
      stroke(this.strokeColor)
    } else {
      noStroke();
    }

    if(!this.isOn()) {
      fill(this.color);
    } else {
      fill(45, 250, 142);
    }
    rect(0, 0, this.width, this.height);
    pop();
  }
}

class InputSocket extends Socket {
  constructor(x, y) {
    super(x, y);
  }

  canEstablishConnection() { return this.connections.length == 0; }
  hasConnection() { return this.connections.length > 0; }

  getPower() { return this.power; }

  connect(connection) {
    this.connections[0] = connection;
  }

  update() {
    super.update();
    // Read value from connection
    if (this.connections[0] != null) {
      this.power = this.connections[0].getPower();
    } else {
      this.power = 0;
    }

    if (this.mouseIsOver) {
      if((this.hasConnection() && editor.dragNode instanceof Connection)
      || (!editor.dragNode && !this.hasConnection()) ) {
        this.strokeColor = color(230, 50, 0);
      } else {
        this.strokeColor = color(0, 230, 50);
      }
    } else {
      this.strokeColor = null;
    }
  }
}

/*
Togglesocket can be used as a normal socket.
Ask for it to toggle when calling apply logic and execute something
*/

class ToggleSocket extends InputSocket {
  constructor(x, y) {
    super(x, y);
    this.toggle = false;
    this.needReset = false;
  }

  test() {
    if(this.toggle && !this.needReset) {
      this.toggle = false;
      this.needReset = true;
      return true;
    }
    return false;
  }

  update() {
    super.update();
    if (this.power == 0) {
      this.needReset = false;
    } else {
      if(!this.needReset) {
        this.toggle = true;
      }
    }
  }
}

class OutputSocket extends Socket {
  constructor(x, y) {
    super(x, y);
  }

  setPower(power) {
    this.power = power;
    for (var i = 0; i < this.connections.length; i++) {
      this.connections[i].setPower(power);
    }
  }

  connect(connection) { this.connections.push(connection); }

  update() {
    super.update();
    if(this.mouseIsOver) {
      if(editor.dragNode instanceof Connection) {
        this.strokeColor = color(230, 50, 0);
      } else {
        this.strokeColor = color(0, 230, 50);
      }
    } else {
      this.strokeColor = null;
    }
  }

}

class Connection extends InteractAble {
  constructor(input, output = null) {
    super(0, 0);
    this.input; // MultiSocket
    this.output; // SingleSocket
    this.setInput(input);
    if (this.output) this.setOutput(output);
    this.power = 0;
    this.thickness = 8;
    this.pos = this.input.getGlobalPosition(); // Used for end of connection when no output exists
  }

  setInput(outputSocket) {
    this.input = outputSocket;
    this.input.connect(this);
  }

  setOutput(inputSocket) {
    this.output = inputSocket;
    this.output.connect(this);
  }

  canSelect() { return false; }

  remove() {
    var index = this.input.connections.indexOf(this);
    this.input.connections.splice(index, 1);
    if(this.output) this.output.connections.pop();
    super.remove();
  }

  getPower() { return this.power; }
  setPower(power) { this.power = power; }
  isOn() { return this.power != 0; }

  draw() {
    super.draw();
    if (this.isOn()) {
      stroke(45, 250, 142);
    } else {
      stroke(0, 100, 0);
    }
    strokeCap(PROJECT);
    strokeWeight(this.thickness);
    noFill();

    var endPoint = this.output ? this.output.getGlobalPosition() : this.pos;
    var startPoint = this.input.getGlobalPosition();

    if (startPoint.x < endPoint.x) {
      var middleX = (endPoint.x - startPoint.x) / 2;
      line(startPoint.x, startPoint.y, startPoint.x + middleX, startPoint.y);
      line(startPoint.x + middleX, startPoint.y, endPoint.x - middleX, endPoint.y);
      line(endPoint.x, endPoint.y, endPoint.x - middleX, endPoint.y);
    } else {
      line(startPoint.x, startPoint.y, startPoint.x + 10, startPoint.y);
      var middleY = (endPoint.y - startPoint.y) / 2;
      line(startPoint.x + 10, startPoint.y, startPoint.x + 10, startPoint.y + middleY);
      line(startPoint.x + 10, startPoint.y + middleY, endPoint.x - 10, startPoint.y + middleY);
      line(endPoint.x - 10, startPoint.y + middleY, endPoint.x - 10, endPoint.y);
      line(endPoint.x - 10, endPoint.y, endPoint.x, endPoint.y);
    }
  }
}
