class Socket extends PlaceAble {
  constructor(x, y) {
    super(x, y);
    this.color = color(50);
    this.width = 10;
    this.height = 10;
    this.on = false;
    this.connections = [];
    sockets.push(this);
  }

  isOn() { return this.on;}
  canEstablishConnection() { return null; }
  connect(connection) {}

  update() {}

  draw() {
    noStroke();
    if(!this.on) {
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

  update() {
    if (this.connections[0] != null) {
      this.on = this.connections[0].isOn();
    } else {
      this.on = false;
    }
  }

  connect(connection) {
    this.connections[0] = connection;
  }

  draw() {
    super.draw();
    if (this.connections[0] != null) {
      this.connections[0].draw();
    }
  }
}

class OutputSocket extends Socket {
  constructor(x, y) {
    super(x, y);
  }

  setOn(bool) { this.on = bool; }
  canEstablishConnection() { return true; }
  connect(connection) { this.connections.push(connection); }

  update() {
    for (var i = 0; i < this.connections.length; i++) {
      this.connections[i].update();
    }
  }

  draw() {
    super.draw();
    for (var i = 0; i < this.connections.length; i++) {
      this.connections[i].draw();
    }
  }
}

class Connection {
  constructor(input, output) {
    this.input = input; // multisocket
    this.output = output; // singlesocket
    this.input.connect(this);
    this.output.connect(this);
    this.on = false;
    this.thickness = 8;
  }

  isOn() { return this.on }
  update() { this.on = this.input.isOn(); }

  delete() {
    var index = this.input.connections.indexOf(this);
    this.input.connections.splice(index, 1);
    this.output.connections.pop();
  }

  draw() {
    if (this.on) {
      stroke(45, 250, 142);
    } else {
      stroke(0, 100, 0);
    }
    strokeCap(PROJECT);
    strokeWeight(this.thickness);
    noFill();

    if (this.input == null || this.output == null) {
      return;
    }

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
