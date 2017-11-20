class Frame extends PlaceAble {
  constructor(x, y) {
    super(x, y);
    this.icon;
    this.mainColor = color(50);
    this.frameColor = color(250)
    this.width = 60;
    this.height = 60;
    this.frameWidth = 6;
  }

  draw() {
    rectMode(CENTER);
    stroke(this.frameColor);
    strokeWeight(this.frameWidth);
    fill(this.mainColor);
    rect(this.pos.x, this.pos.y, this.width, this.height);
  }
}

/*
Logic Update
  update all InputSocket
    -> Read power from connection
  apply logic
    -> Set power to wanted OutputSocket
      -> Set power to connection
*/

class Logic extends Frame {
  constructor(name, x, y, inputCount, outputCount, inputClass = InputSocket) {
    super(x, y);
    this.name = name;
    this.icon;

    this.inputs = [];
    this.output = [];

    var sockets = max(inputCount, outputCount);
    var pxPerSocket = sockets == 1 ? 60 : 30;
    this.height = max(60, sockets * pxPerSocket); //min 60 px

    for (var i = 0; i < inputCount; i++) {
      this.inputs.push(new inputClass(0, 0));
    }
    for (var i = 0; i < outputCount; i++) {
      this.output.push(new OutputSocket(0, 0));
    }

    this.positionSockets();
  }

  positionSockets() {
    var pxPerInput = this.height / this.inputs.length;
    var pxPerOutput = this.height / this.output.length;

    for (var i = 0; i < this.inputs.length; i++) {
      var x = this.pos.x - this.width / 2;
      var y = (this.pos.y - this.height / 2) + (pxPerInput * i) + (pxPerInput / 2);
      this.inputs[i].pos = createVector(x, y);
    }

    for (var i = 0; i < this.output.length; i++) {
      var x = this.pos.x + this.width / 2;
      var y = (this.pos.y - this.height / 2) + (pxPerOutput * i) + (pxPerOutput / 2);
      this.output[i].pos = createVector(x, y);
    }
  }

  update() {
    for (var i = 0; i < this.inputs.length; i++) {
      var input = this.inputs[i];
      input.update();
    }

    this.applyLogic();
  }

  applyLogic() {}

  draw() {
    super.draw();

    // text
    noStroke();
    fill(this.frameColor);
    textAlign(CENTER);
    text(this.name, this.pos.x, this.pos.y + this.height * 0.80);

    for (var i = 0; i < this.inputs.length; i++) {
      var input = this.inputs[i];
      input.draw();
    }
    for (var i = 0; i < this.output.length; i++) {
      var output = this.output[i];
      output.draw();
    }
  }
}

class LogicBattery extends Logic {
  constructor(x, y) {
    super("BATTERY", x, y, 0, 1);
    this.power = 100;
  }

  applyLogic() {
    this.output[0].setPower(this.power);
  }
}


/*
  TODO: Main logic should have a bottomSocket, where a toggleSocket can be applied.
  ToggleSockets sohuld be able to use as input aswell.
*/
class LogicWithBottomToggler extends Logic {
  constructor(name, x, y, inputCount, outputCount, inputClass) {
    super(name, x, y, inputCount, outputCount, inputClass);
    this.toggleSocket = new ToggleSocket(this.pos.x, this.pos.y + this.height / 2);
  }

  positionSockets() {
    super.positionSockets();
    if (this.toggleSocket != null) {
      this.toggleSocket.pos = createVector(this.pos.x, this.pos.y + this.height / 2);
    }
  }

  update() {
      super.update();
      this.toggleSocket.update();
  }

  draw() {
    super.draw();
    this.toggleSocket.draw();
  }
}

class LogicTimer extends LogicWithBottomToggler {
  constructor(x, y) {
    super("TIMER", x, y, 1, 1);
    this.current = 0;
    this.max = 100;
  }

  applyLogic() {
    if(this.toggleSocket.test()) {
      this.current = 0;
    }

    if (this.inputs[0].isOn()) {
      this.current += 1;
      if (this.current >= this.max) {
        this.current = this.max
      }
    }

    if (this.current == this.max) {
      this.output[0].setPower(100);
    } else {
      this.output[0].setPower(0);
    }
  }

  draw() {
    super.draw();
    textAlign(CENTER);
    fill(255);
    noStroke();
    text(this.current/this.max + "%", this.pos.x, this.pos.y);
  }
}

class LogicCounter extends LogicWithBottomToggler {
  constructor(x, y) {
    super("TIMER", x, y, 1, 1, ToggleSocket);
    this.current = 0;
    this.max = 10;
  }

  applyLogic() {
    if(this.toggleSocket.test()) {
      this.current = 0;
    }

    if(this.inputs[0].test()) {
      this.current += 1;
      if (this.current >= this.max) {
        this.current = this.max
      }
    }

    if (this.current == this.max) {
      this.output[0].setPower(100);
    } else {
      this.output[0].setPower(0);
    }
  }

  draw() {
    super.draw();
    textAlign(CENTER);
    fill(255);
    noStroke();
    text(this.current, this.pos.x, this.pos.y);
  }
}

class LogicSelector extends LogicWithBottomToggler {
  constructor(x, y) {
    super("SELECTOR", x, y, 3, 3);
    this.selected = 0;
  }

  applyLogic() {

    if(this.toggleSocket.test()) {
      this.output[this.selected].setPower(0);
      if (this.selected == this.output.length - 1) {
        this.selected = 0;
      } else {
        this.selected += 1;
      }
    }

    for (var i = 0; i < this.inputs.length; i++) {
      if (this.inputs[i].isOn()) {
        this.output[this.selected].setPower(0);
        this.selected = i;
      }
    }
    this.output[this.selected].setPower(100);
  }
}

class LogicOr extends Logic {
  constructor(x, y) {
    super("OR", x, y, 2, 1);
  }

  applyLogic() {
    if(this.inputs[0].isOn() || this.inputs[1].isOn()) {
      this.output[0].setPower(max(this.inputs[0].getPower(), this.inputs[1].getPower()));
    } else {
      this.output[0].setPower(0);
    }
  }
}

class LogicAnd extends Logic {
  constructor(x, y) {
    super("AND", x, y, 2, 1);
  }

  applyLogic() {
    if(this.inputs[0].isOn() && this.inputs[1].isOn()) {
      this.output[0].setPower(max(this.inputs[0].getPower(), this.inputs[1].getPower()));
    } else {
      this.output[0].setPower(0);
    }
  }
}

class LogicXor extends Logic {
  constructor(x, y) {
    super("XOR", x, y, 2, 1);
  }

  applyLogic() {
    if(this.inputs[0].isOn() != this.inputs[1].isOn()) {
      this.output[0].setPower(max(this.inputs[0].getPower(), this.inputs[1].getPower()));
    } else {
      this.output[0].setPower(0);
    }
  }
}

class LogicNot extends Logic {
  constructor(x, y) {
    super("NOT", x, y, 1, 1);
  }

  applyLogic() {
    if(this.inputs[0].isOn() == false) {
      this.output[0].setPower(100);
    } else {
      this.output[0].setPower(0);
    }
  }
}
