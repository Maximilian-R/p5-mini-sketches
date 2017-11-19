class Socket extends PlaceAble {
  constructor(x, y) {
    super(x, y);
    this.color = color(50);
    this.width = 10;
    this.height = 10;
    this.power = 0;
    this.connections = [];
    sockets.push(this);
  }

  /* Check if any power is applied */
  isOn() { return this.power != 0; }
  /* Check if a connection can be added */
  canEstablishConnection() { return true; }
  /* Add a connection */
  connect(connection) {}

  update() {}

  draw() {
    noStroke();
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
  }
}

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
      this.toggle = true;
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
}

class Connection {
  constructor(input, output) {
    this.input = input; // MultiSocket
    this.output = output; // SingleSocket
    this.input.connect(this);
    this.output.connect(this);
    this.power = 0;
    this.thickness = 8;
    connections.push(this);
  }

  getPower() { return this.power; }
  setPower(power) { this.power = power; }
  isOn() { return this.power != 0; }

  delete() {
    var index = this.input.connections.indexOf(this);
    this.input.connections.splice(index, 1);
    this.output.connections.pop();
    connections.splice(connections.indexOf(this), 1);
  }

  draw() {
    if (this.isOn()) {
      stroke(45, 250, 142);
    } else {
      stroke(0, 100, 0);
    }
    strokeCap(PROJECT);
    strokeWeight(this.thickness);
    noFill();

    // line(this.input.pos.x, this.input.pos.y, this.output.pos.x, this.output.pos.y);
    // return;

    if (this.input.pos.x < this.output.pos.x) {
      var middleX = (this.output.pos.x - this.input.pos.x) / 2;
      line(this.input.pos.x, this.input.pos.y, this.input.pos.x + middleX, this.input.pos.y);
      line(this.input.pos.x + middleX, this.input.pos.y, this.output.pos.x - middleX, this.output.pos.y);
      line(this.output.pos.x, this.output.pos.y, this.output.pos.x - middleX, this.output.pos.y);
    } else {
      line(this.input.pos.x, this.input.pos.y, this.input.pos.x + 10, this.input.pos.y);
      var middleY = (this.output.pos.y - this.input.pos.y) / 2;
      line(this.input.pos.x + 10, this.input.pos.y, this.input.pos.x + 10, this.input.pos.y + middleY);
      line(this.input.pos.x + 10, this.input.pos.y + middleY, this.output.pos.x - 10, this.input.pos.y + middleY);
      line(this.output.pos.x - 10, this.input.pos.y + middleY, this.output.pos.x - 10, this.output.pos.y);
      line(this.output.pos.x - 10, this.output.pos.y, this.output.pos.x, this.output.pos.y);
    }
  }
}
