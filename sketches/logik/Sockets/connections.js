class Socket extends ElectricComponent {
  constructor(x, y) {
    super(x, y, new Dimension(12, 12));
    this.color = color(50);
    this.strokeColor;
    //this.power = 0;
    this.connections = [];
  }

  isColliding(point) {
    if (this.position.dist(point) < this.dimension.width) return true;
    return false;
  }

  canManualRemove() { return false; }

  remove() {
    for (var i = this.connections.length - 1; i >= 0; i--) {
      this.connections[i].remove();
    }
    super.remove();
  }

  isOn() { return this.power != 0; }
  canEstablishConnection() { return true; }

  connect(connection) {}

  update() {
    super.update();
  }

  draw() {
    super.draw();
    if (this.strokeColor) {
      strokeWeight(2);
      stroke(this.strokeColor)
    } else {
      noStroke();
    }

    if(!this.isOn()) {
      fill(this.color);
    } else {
      fill('#7DF9FF');
    }
    rect(0, 0, this.dimension.width, this.dimension.height, 3, 3);
  }
}

class InputSocket extends Socket {
  constructor(x, y) {
    super(x, y);
  }

  canEstablishConnection() { return this.connections.length == 0; }
  hasConnection() { return this.connections.length > 0; }

  //getPower() { return this.power; }

  connect(connection) {
    this.connections[0] = connection;
  }

  update() {
    super.update();
    // Read value from connection
    if (this.connections[0] != null) {
      //this.power = this.connections[0].getPower();
    } else {
      //this.power = 0;
    }

    if (this.mouseIsOver) {
      if((this.hasConnection() && world.editor.connection instanceof Connection)
      || (!world.editor.connection && !this.hasConnection()) ) {
        this.strokeColor = color(230, 50, 0);
      } else {
        this.strokeColor = color(0, 230, 50);
      }
    } else {
      this.strokeColor = null;
    }
  }

  prepareState() {
    //if (!this.hasConnection()) return;
    const incomingPower = this.hasConnection() ? this.connections[0].power : 0;
    if (incomingPower !== 0 && this.power !== incomingPower) {
      this.nextState = new State(incomingPower);
    } else if (incomingPower === 0 && this.power !== 0) {
      this.nextState = new State(0);
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

  prepareState() {
    // output is not aware of what it's attatched to
  }

  setPower(power) {
    this.nextState = new State(power);
  }

  connect(connection) { this.connections.push(connection); }

  update() {
    super.update();
    if(this.mouseIsOver) {
      if(world.editor.connection instanceof Connection) {
        this.strokeColor = color(230, 50, 0);
      } else {
        this.strokeColor = color(0, 230, 50);
      }
    } else {
      this.strokeColor = null;
    }
  }
}