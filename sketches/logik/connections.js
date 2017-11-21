class Socket extends WorldNode {
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

  remove() {
    for (var i = 0; i < this.connections.length; i++) {
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

  update() {}

  draw() {
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
    rect(this.pos.x, this.pos.y, this.width, this.height);
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

  startHover(editorHoldingNode) {
    if((this.hasConnection() && editorHoldingNode instanceof Connection)
    || (!editorHoldingNode && !this.hasConnection()) ) {
      this.strokeColor = color(230, 50, 0);
    } else {
      this.strokeColor = color(0, 230, 50);
    }
  }

  endHover() { this.strokeColor = null; }

  update() {
    super.update();
    // Read value from connection
    if (this.connections[0] != null) {
      this.power = this.connections[0].getPower();
    } else {
      this.power = 0;
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

  startHover(editorHoldingNode) {
    if(editorHoldingNode instanceof Connection) {
      this.strokeColor = color(230, 50, 0);
    } else {
      this.strokeColor = color(0, 230, 50);
    }
  }

  endHover() { this.strokeColor = null; }
}

class Connection extends WorldNode {
  constructor(input, output = null) {
    super(0, 0);
    this.input; // MultiSocket
    this.output; // SingleSocket
    this.setInput(input);
    if (this.output) this.setOutput(output);
    this.power = 0;
    this.thickness = 8;
    this.pos = this.input.pos.copy(); // Used for end of connection when no output exists
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
    connections.splice(connections.indexOf(this), 1);
    super.remove();
  }

  getPower() { return this.power; }
  setPower(power) { this.power = power; }
  isOn() { return this.power != 0; }

  draw() {
    if (this.isOn()) {
      stroke(45, 250, 142);
    } else {
      stroke(0, 100, 0);
    }
    strokeCap(PROJECT);
    strokeWeight(this.thickness);
    noFill();

    // line(this.input.pos.x, this.input.pos.y, endPoint.x, endPoint.y);
    // return;

    var endPoint = this.output ? this.output.pos : this.pos;

    if (this.input.pos.x < endPoint.x) {
      var middleX = (endPoint.x - this.input.pos.x) / 2;
      line(this.input.pos.x, this.input.pos.y, this.input.pos.x + middleX, this.input.pos.y);
      line(this.input.pos.x + middleX, this.input.pos.y, endPoint.x - middleX, endPoint.y);
      line(endPoint.x, endPoint.y, endPoint.x - middleX, endPoint.y);
    } else {
      line(this.input.pos.x, this.input.pos.y, this.input.pos.x + 10, this.input.pos.y);
      var middleY = (endPoint.y - this.input.pos.y) / 2;
      line(this.input.pos.x + 10, this.input.pos.y, this.input.pos.x + 10, this.input.pos.y + middleY);
      line(this.input.pos.x + 10, this.input.pos.y + middleY, endPoint.x - 10, this.input.pos.y + middleY);
      line(endPoint.x - 10, this.input.pos.y + middleY, endPoint.x - 10, endPoint.y);
      line(endPoint.x - 10, endPoint.y, endPoint.x, endPoint.y);
    }
  }
}
