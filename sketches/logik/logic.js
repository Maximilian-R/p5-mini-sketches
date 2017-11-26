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
    if (this.pos.dist(point) < this.width ) return true;
    return false;
  }

  draw() {
    rectMode(CENTER);
    push();
    translate(this.pos.x, this.pos.y);
    if(this.mouseIsOver || this.mouseIsPressed || this.mouseWasClicked) {
      this.frameUseColor = this.highLightColor;
    } else {
      this.frameUseColor = this.frameColor;
    }
    stroke(this.frameUseColor);
    strokeWeight(this.frameWidth);
    fill(this.mainColor);
    rect(0, 0, this.width, this.height);

    // Text
    noStroke();
    fill(this.frameColor);
    textAlign(CENTER);
    text(this.name, 0, 0 - this.height * 0.5 - 6);
    pop();
    super.draw();
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
  constructor(name, x, y, inputCount, outputCount, bottomSocket = false, inputClass = InputSocket) {
    super(name, x, y);
    this.icon;

    this.inputs = [];
    this.output = [];
    this.bottomSocket = bottomSocket ? this.addChild(new ToggleSocket(0, this.height / 2)) : null;

    var sockets = max(inputCount, outputCount);
    var pxPerSocket = sockets == 1 ? 60 : 30;
    this.height = max(60, sockets * pxPerSocket); //min 60 px

    for (var i = 0; i < inputCount; i++) {
      var inputSocket = new inputClass(0, 0);
      this.addChild(inputSocket);
      this.inputs.push(inputSocket);
    }
    for (var i = 0; i < outputCount; i++) {
      var outputSocket = new OutputSocket(0, 0);
      this.addChild(outputSocket);
      this.output.push(outputSocket);
    }

    this.layoutSockets();


    this.gui = new dat.GUI();
    this.gui.add(this, 'name');
    this.gui.hide();
  }

  deselect() {
    this.gui.hide();
  }

  select() {
    this.gui.show();
  }

  mouseClicked() {

  }

  layoutSockets() {
    var pxPerInput = this.height / this.inputs.length;
    var pxPerOutput = this.height / this.output.length;

    for (var i = 0; i < this.inputs.length; i++) {
      var x = -this.width / 2;
      var y = (-this.height / 2) + (pxPerInput * i) + (pxPerInput / 2);
      this.inputs[i].pos = createVector(x, y);
    }

    for (var i = 0; i < this.output.length; i++) {
      var x = this.width / 2;
      var y = (-this.height / 2) + (pxPerOutput * i) + (pxPerOutput / 2);
      this.output[i].pos = createVector(x, y);
    }

    if (this.bottomSocket != null) {
      this.bottomSocket.pos = createVector(0, this.height / 2);
    }
  }

  update() {
    super.update();
    this.applyLogic();
  }

  applyLogic() {}

  remove() {
    this.gui.destroy();
    for (var i = 0; i < this.children.length; i++) {
      this.children[i].remove();
    }
    super.remove();
  }
}

class LogicBattery extends Logic {
  constructor(x, y) {
    super("BATTERY", x, y, 0, 1);
    this.power = 100;

    this.gui.add(this, 'power', -100, 100).step(10);
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

    this.gui.add(this, 'max').step(1);
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
    push();
    translate(this.pos.x, this.pos.y);
    textAlign(CENTER);
    fill(255);
    noStroke();
    text(this.current/this.max + "%", 0, 0);
    pop();
  }
}

class LogicCounter extends Logic {
  constructor(x, y) {
    super("COUNTER", x, y, 1, 1, true, ToggleSocket);
    this.current = 0;
    this.min = 0;
    this.max = 10;

    this.gui.add(this, 'min').step(1);
    this.gui.add(this, 'max').step(1);
  }

  applyLogic() {
    if(this.bottomSocket.test()) {
      this.current = 0;
    }

    if(this.inputs[0].test()) {
      this.current += this.inputs[0].getPower() > 0 ? 1 : -1 ;
      if (this.current >= this.max) {
        this.current = this.max
        this.output[0].setPower(100);
      } else if (this.current <= this.min) {
        this.current = this.min;
      } else {
        this.output[0].setPower(0);
      }
    }
  }

  draw() {
    super.draw();
    push();
    translate(this.pos.x, this.pos.y);
    textAlign(CENTER);
    fill(255);
    noStroke();
    text(this.current, 0, 0);
    pop();
  }
}

class LogicSelector extends Logic {
  constructor(x, y) {
    super("SELECTOR", x, y, 3, 3, true);
    this.selected = 0;
    this.choices = 3;
    // here gui must update the amount of I/O sockets and frame height

    this.gui.add(this, 'choices').min(0).max(10).step(1);
  }

  applyLogic() {

    if(this.bottomSocket.test()) {
      this.output[this.selected].setPower(0);
      if(this.bottomSocket.getPower() < 0) {
        this.selected -= 1;
        if (this.selected < 0) {
          this.selected = this.output.length - 1;
        }
      } else if (this.bottomSocket.getPower() > 0) {
        this.selected += 1;
        if (this.selected > this.output.length -1) {
          this.selected = 0;
        }
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
    super("SPLITTER", x, y, 1, 2);
  }

  applyLogic() {
    this.output[1].setPower(0);
    this.output[0].setPower(0);

    if(this.inputs[0].getPower() > 0) {
      this.output[0].setPower(100);
    } else if (this.inputs[0].getPower() < 0) {
      this.output[1].setPower(100);
    }
  }
}

class LogicCombiner extends Logic {
  constructor(x, y) {
    super("COMBINER", x, y, 2, 1);
  }

  applyLogic() {
    if (this.inputs[0].isOn() && this.inputs[1].isOn())  {
      this.output[0].setPower(0);
    } else if (this.inputs[1].isOn()) {
      this.output[0].setPower(-100);
    } else if (this.inputs[0].isOn()) {
      this.output[0].setPower(100);
    } else {
      this.output[0].setPower(0);
    }
  }
}

class LogicKeyInput extends Logic {
  constructor(x, y) {
    super("KEYINPUT", x, y, 0, 1);
    this.key = 'A';

    this.gui.add(this, 'key');
  }

  applyLogic() {
    if (char(mouseHandler.pressedKey) == this.key) {
      this.output[0].setPower(100);
    } else {
      this.output[0].setPower(0);
    }
  }

  draw() {
    super.draw();
    push();
    translate(this.pos.x, this.pos.y);
    textAlign(CENTER);
    fill(255);
    noStroke();
    text(this.key, 0, 0);
    pop();
  }
}
