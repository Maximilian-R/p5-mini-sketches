class Frame extends InteractAble {
  constructor(name, x, y) {
    super(x, y);
    this.name = name;
    this.icon;
    this.mainColor = color(50);
    this.frameColor = color(250);
    this.highLightColor = color(112, 2, 124);
    this.frameUseColor = this.frameColor;
    this.width = 60;
    this.height = 60;
    this.frameWidth = 6;
  }

  isColliding(point) {
    if (this.pos.dist(point) < this.width * 0.7) return true;
    return false;
  }

  draw() {
    rectMode(CENTER);
    stroke(this.frameUseColor);
    strokeWeight(this.frameWidth);
    fill(this.mainColor);
    rect(this.pos.x, this.pos.y, this.width, this.height);

    // text
    noStroke();
    fill(this.frameColor);
    textAlign(CENTER);
    text(this.name, this.pos.x, this.pos.y - this.height * 0.5 - 6);
  }

  pickup() { this.highlight() }
  startHover() { this.highlight() }
  didSelect() { this.highlight() }
  endHover() { this.noHighlight() }
  drop() { this.noHighlight() }
  didUnSelect() { this.noHighlight() }
  highlight() { this.frameUseColor = this.highLightColor; }
  noHighlight() { this.frameUseColor = this.frameColor; }
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
  constructor(name, x, y, inputCount, outputCount, bottomSocket = false, inputClass = InputSocket) {
    super(name, x, y);
    this.icon;

    this.inputs = [];
    this.output = [];
    this.bottomSocket = bottomSocket ? new ToggleSocket(this.pos.x, this.pos.y + this.height / 2) : null;

    var sockets = max(inputCount, outputCount);
    var pxPerSocket = sockets == 1 ? 60 : 30;
    this.height = max(60, sockets * pxPerSocket); //min 60 px

    for (var i = 0; i < inputCount; i++) {
      this.inputs.push(new inputClass(0, 0));
    }
    for (var i = 0; i < outputCount; i++) {
      this.output.push(new OutputSocket(0, 0));
    }

    this.drag();
  }

  drag() {
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

    if (this.bottomSocket != null) {
      this.bottomSocket.pos = createVector(this.pos.x, this.pos.y + this.height / 2);
    }
  }

  update() {
    for (var i = 0; i < this.inputs.length; i++) {
      var input = this.inputs[i];
      input.update();
    }

    if (this.bottomSocket != null) {
      this.bottomSocket.update();
    }

    this.applyLogic();
  }

  applyLogic() {}

  draw() {
    super.draw();

    for (var i = 0; i < this.inputs.length; i++) {
      var input = this.inputs[i];
      input.draw();
    }
    for (var i = 0; i < this.output.length; i++) {
      var output = this.output[i];
      output.draw();
    }

    if (this.bottomSocket != null) {
      this.bottomSocket.draw();
    }
  }

  remove() {
    for (var i = 0; i < this.inputs.length; i++) {
      this.inputs[i].remove();
    }
    for (var i = 0; i < this.output.length; i++) {
      this.output[i].remove();
    }
    if(this.bottomSocket != null) {
      this.bottomSocket.remove();
    }
    super.remove();
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

class LogicTimer extends Logic {
  constructor(x, y) {
    super("TIMER", x, y, 1, 1, true);
    this.current = 0;
    this.max = 100;
  }

  applyLogic() {
    if(this.bottomSocket.test()) {
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

class LogicCounter extends Logic {
  constructor(x, y) {
    super("COUNTER", x, y, 1, 1, true, ToggleSocket);
    this.current = 0;
    this.max = 10;
  }

  applyLogic() {
    if(this.bottomSocket.test()) {
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

class LogicSelector extends Logic {
  constructor(x, y) {
    super("SELECTOR", x, y, 3, 3, true);
    this.selected = 0;
  }

  applyLogic() {

    if(this.bottomSocket.test()) {
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

class LogicSwitch extends Logic {
  constructor(x, y) {
    super("TOGGLE", x, y, 1, 1, false, ToggleSocket);
    this.toggled = false;
  }

  applyLogic() {
    if(this.inputs[0].test()) {
      this.toggled = !this.toggled;
      this.toggled ? this.output[0].setPower(100) : this.output[0].setPower(0);
    }
  }
}

class LogicSplitter extends Logic {
  constructor(x, y) {
    super("SPLITTER", x, y, 1, 2, false);
  }

  applyLogic() {
    this.output[1].setPower(0);
    this.output[0].setPower(0);

    if(this.inputs[0].getPower() > 0) {
      this.output[0].setPower(100);
    } else if (this.inputs[1].getPower() < 0) {
      this.output[1].setPower(100);
    }
  }
}

class LogicCombiner extends Logic {
  constructor(x, y) {
    super("COMBINER", x, y, 2, 1, false);
  }

  applyLogic() {
    if (this.input[0].isOn() && this.input[0].isOn())  {
      this.output[0].setPower(0);
    } else if (this.input[1].isOn()) {
      this.output[0].setPower(-100);
    } else if (this.input[0].isOn()) {
      this.output[0].setPower(100);
    } else {
      this.output[0].setPower(0);
    }
  }
}
