class Socket extends ElectricComponent {
  constructor(x, y) {
    super(x, y);
    this.size = new Dimension(12, 12);
    this.collider = new ColliderBox(this, this.size);
    this.color = color(50);
    this.strokeColor;
    //this.power = 0;
    this.connections = [];
    this.isHighlight = false;
  }

  get width() {
    return this.size.width;
  }

  get height() {
    return this.size.height;
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
    rect(0, 0, this.width, this.height, 3, 3);
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

    if (this.isHighlight) {
      if((this.hasConnection() && mainHandler.world.editor.connection instanceof Connection)
      || (!mainHandler.world.editor.connection && !this.hasConnection()) ) {
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
    if (incomingPower !== this.power) {
      this.nextState = new State(incomingPower);
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
    this.toggled = false;
  }

  check() {
    if (this.toggled) {
      this.toggled = false;
      return true;
    }
    return false;
  }

  prepareState() {
    const incomingPower = this.hasConnection() ? this.connections[0].power : 0;
    if (incomingPower !== this.power) {

      // Toggle whenever going from 0 to on, or from positive <-> negative
      const wasZero = incomingPower !== 0 && this.power === 0;
      const posToNeg = incomingPower < 0 && this.power > 0;
      const negToPos = incomingPower > 0 && this.power < 0;
      if (wasZero || posToNeg || negToPos) {
        this.toggled = true;
      }

      this.nextState = new State(incomingPower);
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
    if(this.isHighlight) {
      if(mainHandler.world.editor.connection instanceof Connection) {
        this.strokeColor = color(230, 50, 0);
      } else {
        this.strokeColor = color(0, 230, 50);
      }
    } else {
      this.strokeColor = null;
    }
  }
}