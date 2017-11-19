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

    // Only Output sockets update and draw connections.
    // Thats why its possible to update and draw sockets here
    // without doing it twice. But this require evyerthing
    // with sockets to update its sockets...
    for (var i = 0; i < this.inputs.length; i++) {
      var input = this.inputs[i];
      input.update();
    }
    for (var i = 0; i < this.output.length; i++) {
      var output = this.output[i];
      output.update();
    }
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
  }

  applyLogic() {
    this.output[0].setOn(true);
  }
}

class LogicSelector extends Logic {
  constructor(x, y) {
    super("SELECTOR", x, y, 3, 3);
    this.selected = 0;
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
