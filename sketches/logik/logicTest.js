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
    //rectMode(CENTER);
    stroke(this.frameColor);
    strokeWeight(this.frameWidth);
    fill(this.mainColor);
    rect(this.pos.x, this.pos.y, this.width, this.height);
  }
}

class Logic extends Frame {
  constructor(name, x, y, inputCount, outputCount) {
    super(x, y);
    this.name = name;
    this.icon;

    this.inputs = [];
    this.output = [];

    var sockets = max(inputCount, outputCount);
    var pxPerSocket = sockets == 1 ? 60 : 30;
    this.height = max(60, sockets * pxPerSocket); //min 60 px

    for (var i = 0; i < inputCount; i++) {
      this.inputs.push(new InputSocket(0, 0));
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
    this.power;
    this.setPower(100);
  }

  setPower(power) {
    this.power = power;
    this.output[0].setPower(power);
  }

  applyLogic() {
    //this.output[0].setOn(true);
  }
}


class LogicToggleSocket extends Logic {
  constructor(name, x, y, inputs, outputs) {
    super(name, x, y, inputs, outputs);
    this.lastToggle = false;
    this.toggleSocket = new InputSocket(this.pos.x, this.pos.y + this.height / 2);
  }

  update() {
    super.update();
    this.toggleSocket.update();

    if (this.toggleSocket.on == true && !this.lastToggle) {
      this.lastToggle = true;
      this.toggle();
    } else if (this.toggleSocket.on == false) {
      this.lastToggle = false;
    }
  }

  draw() {
    super.draw();
    this.toggleSocket.draw();
  }

  toggle() {
  }
}

class LogicTimer extends LogicToggleSocket {
  constructor(x, y) {
    super("TIMER", x, y, 1, 1);
    this.current = 0;
    this.max = 100;
  }

  update() {
    super.update();
  }

  applyLogic() {
    if (this.inputs[0].isOn()) {
      this.current += 1;
      if (this.current >= this.max) {
        this.current = this.max
      }
    }

    if (this.current == this.max) {
      this.output[0].setOn(true);
    } else {
      this.output[0].setOn(false);
    }
  }

  toggle() {
    this.current = 0;
  }

  draw() {
    super.draw();
    textAlign(CENTER);
    fill(255);
    noStroke();
    text(this.current/this.max + "%", this.pos.x, this.pos.y);
  }
}

class LogicSelector extends LogicToggleSocket {
  constructor(x, y) {
    super("SELECTOR", x, y, 3, 3);
    this.selected = 0;
    this.lastCycle = false;
    this.cycleSocket = new InputSocket(this.pos.x, this.pos.y + this.height / 2);
  }

  update() {
    super.update();
  }

  draw() {
    super.draw();
  }

  applyLogic() {
    for (var i = 0; i < this.inputs.length; i++) {
      if (this.inputs[i].on == true) {
        this.output[this.selected].setOn(false);
        this.selected = i;
      }
    }
    this.output[this.selected].setOn(true);
  }

  toggle() {
    this.output[this.selected].setOn(false);
    if (this.selected == this.output.length - 1) {
      this.selected = 0;
    } else {
      this.selected += 1;
    }
  }
}

class LogicOr extends Logic {
  constructor(x, y) {
    super("OR", x, y, 2, 1);
  }

  applyLogic() {
    if(this.inputs[0].isOn() || this.inputs[1].isOn()) {
      this.output[0].setOn(true);
    } else {
      this.output[0].setOn(false);
    }
  }
}

class LogicAnd extends Logic {
  constructor(x, y) {
    super("AND", x, y, 2, 1);
  }

  applyLogic() {
    if(this.inputs[0].on == true && this.inputs[1].on == true) {
      this.output[0].setOn(true);
    } else {
      this.output[0].setOn(false);
    }
  }
}

class LogicXor extends Logic {
  constructor(x, y) {
    super("XOR", x, y, 2, 1);
  }

  applyLogic() {
    if(this.inputs[0].on != this.inputs[1].on) {
      this.output[0].setOn(true);
    } else {
      this.output[0].setOn(false);
    }
  }
}

class LogicNot extends Logic {
  constructor(x, y) {
    super("NOT", x, y, 1, 1);
  }

  applyLogic() {
    if(this.inputs[0].on) {
      this.output[0].setOn(false);
    } else {
      this.output[0].setOn(true);
    }
  }
}
