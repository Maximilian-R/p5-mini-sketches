class Frame extends InteractAble {
  constructor(name, x, y) {
    super(x, y);

    /* Common Attributes */
    this.name = name;
    this.icon;

    /* Color Attributes */
    this.mainColor = '#2b3544';
    this.frameColor = '#e81b64';
    this.highLightColor = color(250);

    /* Size Attributes */
    this.width = 60;
    this.height = 60;
    this.frameWidth = 6;
  }

  isColliding(point) {
    if (this.pos.dist(point) < this.width) return true;
    return false;
  }

  draw() {
    super.draw();

    /* Draw Frame */
    rectMode(CENTER);
    push();
    translate(this.pos.x, this.pos.y);
    if(this.mouseIsOver || this.mouseIsPressed || this.hasFocus) {
      stroke(color(this.highLightColor));
    } else {
      stroke(color(this.frameColor));
    }
    strokeWeight(this.frameWidth);
    fill(color(this.mainColor));
    rect(0, 0, this.width, this.height, 10);

    /* Text Above Frame */
    noStroke();
    fill(color('#2b3544'));
    textAlign(CENTER);
    text(this.name, 0, 0 - this.height * 0.5 - 6);
    pop();
  }
}

class Logic extends Frame {
  constructor(name, x, y, inputCount, outputCount, bottomSocket = false, inputClass = InputSocket) {
    super(name, x, y);

    /* Sockets */
    this.inputs = [];
    this.output = [];
    this.bottomSocket = bottomSocket ? this.addChild(new ToggleSocket(0, this.height / 2)) : null;

    /* Calculate Required Height for all sockets to get space */
    var maxSockets = max(inputCount, outputCount);
    var pxPerSocket = maxSockets == 1 ? 60 : 30;
    this.height = max(60, maxSockets * pxPerSocket); /* Min 60 px */

    /* Create Defined Sockets */
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

    /* Create GUI */
    this.gui = new dat.GUI();
    this.gui.addColor(this, 'frameColor');
    this.gui.add(this, 'name');
    this.gui.hide();

    saveObjects.push(this);
  }

  /* Positions Sockets in a nice fashion! */
  layoutSockets() {
    var pxPerInput = this.height / this.inputs.length;
    var pxPerOutput = this.height / this.output.length;

    for (var i = 0; i < this.inputs.length; i++) {
      var x = -this.width / 2 - 4;
      var y = (-this.height / 2) + (pxPerInput * i) + (pxPerInput / 2);
      this.inputs[i].pos = createVector(x, y);
    }

    for (var i = 0; i < this.output.length; i++) {
      var x = this.width / 2 + 4;
      var y = (-this.height / 2) + (pxPerOutput * i) + (pxPerOutput / 2);
      this.output[i].pos = createVector(x, y);
    }

    if (this.bottomSocket != null) {
      this.bottomSocket.pos = createVector(0, this.height / 2 + 4);
    }
  }

  update() {
    super.update();
    this.applyLogic();
  }

  /* Apply Logic is called Once every update to define power to output sockets */
  applyLogic() {}

  remove() {
    this.gui.destroy();
    for (var i = 0; i < this.children.length; i++) {
      this.children[i].remove();
    }
    super.remove();
  }

  toJson() {
    var objectJson = {
       "x" : this.pos.x,
       "y" : this.pos.y,
       "name" : this.name,
       "class" : this.constructor.name
    };
    return objectJson;
  }
}

class LogicBattery extends Logic {
  constructor(x, y) {
    super("BATTERY", x, y, 0, 1);

    /* Logic Specific Attributes */
    this.power = 100;

    /* Configure GUI */
    this.gui.add(this, 'power', -100, 100).step(10);
  }

  /* Always apply configured power */
  applyLogic() {
    this.output[0].setPower(this.power);
  }
}

class LogicTimer extends Logic {
  constructor(x, y) {
    super("TIMER", x, y, 1, 1, true);

    /* Logic Specific Attributes */
    this.current = 0;
    this.max = 100;

    /* Configure GUI */
    this.gui.add(this, 'max').step(1);
  }

  /*
  Ticks while having input power
  Send output power when reached maximum
  Resets by applying power to togglesocket at bottom
  */
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

  toJson() {
    var objectData = super.toJson();
    objectData["current"] = this.current;
    objectData["max"] = this.max;
    return objectData;
  }
}

class LogicCounter extends Logic {
  constructor(x, y) {
    super("COUNTER", x, y, 1, 1, true, ToggleSocket);

    /* Logic Specific Attributes */
    this.current = 0;
    this.min = 0;
    this.max = 10;

    /* Configure GUI */
    this.gui.add(this, 'min').step(1);
    this.gui.add(this, 'max').step(1);
  }

  /*
  Whenever a new input power is sent, count either +1 or -1
  depending on positive or negative input signal.
  Whenever Full, apply power to output
  Reset with togglesocket at bottom.
  */
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

    /* Logic Specific Attributes */
    this.selected = 0;
    this.choices = 3;

    // TODO:
    // should be handled in main logic
    // gui must update the amount of I/O sockets and frame height

    /* Configure GUI */
    this.gui.add(this, 'choices').min(0).max(10).step(1);
  }

  /*
  Set power to whatever output socket that is paired with the input socket
  having a signal. Only one signal will be handled at the time = One and always
  one output will send power.
  Togglesocket at bottom functions as a cycle, either forward or backward
  depending on positive or negative signal
  */
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

  /* When at least one input is on, send output */
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

  /* When all inputs are on, send output */
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

  /* When one and only one input is on, send output */
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

  /* Send output opposite of input */
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

    /* Logic Specific Attributes */
    this.toggled = false;
  }

  /* Whenever an input signal is given, change state */
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

  /* Input splits negative and positve signal into two separate outputs */
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

  /*
  Input combines a negative and positve input into one output with positive
  or negative signal
  */
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

    /* Logic Specific Attributes */
    this.key = 'A';

    /* Configure GUI */
    this.gui.add(this, 'key');
  }

  /* Whenever chosen key is pressed, send output power */
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

// class LogicRandomizer extends Logic {
//   constructor(x, y) {
//     super("RANDOMIZER", x, y, 0, 1);
//     this.key = 'A';
//
//     this.gui.add(this, 'key');
//   }
//
//   applyLogic() {
//     /* Give power to a random output connections
//     REQUIRES A NEW KIND OF OUTPUT SOCKET */
//     if (char(mouseHandler.pressedKey) == this.key) {
//       this.output[0].setPower(100);
//     } else {
//       this.output[0].setPower(0);
//     }
//   }
// }
