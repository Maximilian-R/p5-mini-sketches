// Only update nextstate in prepareState?
// use applylogic still for certain things?
// dont send new state every prepareState...?

class ElectricComponent extends GameObject {
  constructor(x, y) {
    super(x, y);
    this.currentState = new State(0);
    this.nextState; 

    electricComponents.push(this);
  }

  get power() { return this.currentState.power }
  prepareState() {}
  updateState() {
    if (this.nextState) {
      this.currentState = this.nextState;
      this.nextState = null;
    }
  }
}

class State {
  constructor(power) {
    this.power = power;
  }
}

const MIN_SIZE = 2;
class Logic extends ElectricComponent {
  constructor(name, x, y, inputCount, outputCount, bottomSocket = false, inputClass = InputSocket) {
    // Only editor should create new components, there positiong should be fixed
    let p = world.editor.grid.snapToGrid(createVector(x, y));
    super(p.x, p.y);  

    // SQUARE size
    this.size = new Dimension(0, 0);
    this.collider = new ColliderBox(this, this.size);

    /* Sockets */
    this.inputs = [];
    this.output = [];
    this.bottomSocket;

    /* Common Attributes */
    this.name = name;
    this.icon;
    this.centerText;

    /* Color Attributes */
    this.isHighlight = false;
    this.mainColor = '#2b3544';
    this.frameColor = '#3ea285';
    this.highLightColor = color(250);

    /* Size Attributes */
    this.frameWidth = 6;

    this.setup(inputCount, outputCount, inputClass, bottomSocket);

    /* Create GUI */
    this.gui = new dat.GUI();
    this.gui.addColor(this, 'frameColor');
    this.gui.add(this, 'name');
    this.gui.hide();

    saveObjects.push(this);    
  }

  get width() {
    return this.size.width * SQUARE_SIZE;
  }

  get height() {
    return this.size.height * SQUARE_SIZE;
  }

  setup(inputs = 0, outputs = 0, inputClass, bottomSocket) {
    let maxSockets = max(inputs, outputs);

    this.size = new Dimension(2, max(MIN_SIZE, maxSockets));
    this.collider.dimension = new Dimension(this.width, this.height);

    this.inputs = [];
    this.output = [];
    this.bottomSocket = bottomSocket ? this.addChild(new ToggleSocket(this.width / 2 - 5, this.height)) : null;

    let inputOffset = inputs > 1 ? -SQUARE_SIZE * 0.5 : 0;
    for (let i = 0; i < inputs; i++) {
      let socket = new inputClass();
      let y = inputOffset + SQUARE_SIZE * (i + 1) - socket.collider.dimension.height / 2;
      let x = -socket.collider.dimension.width;
      socket.position = createVector(x, y);
      this.addChild(socket);
      this.inputs.push(socket);
    }
    
    let outputOffset = outputs > 1 ? -SQUARE_SIZE * 0.5 : 0;
    for (let i = 0; i < outputs; i++) {
      let socket = new OutputSocket();
      let y = outputOffset + SQUARE_SIZE * (i + 1) - socket.collider.dimension.height / 2;
      let x = this.width;
      socket.position = createVector(x, y);
      this.addChild(socket);
      this.output.push(socket);
    }
  }

  draw() {
    push();
    fill(color(this.mainColor));
    strokeWeight(this.frameWidth);
    if(this.isHighlight) {
      stroke(color(this.highLightColor));
    } else {
      stroke(color(this.frameColor));
    }
    strokeWeight(6);
    rect(0, 0, this.width, this.height, 10, 10);

    /* Text Above Frame */
    noStroke();
    fill(color('#2b3544'));
    textAlign(CENTER);
    text(this.name, this.width / 2, - 6);

    /* Center Text */
    if (this.centerText !== undefined) {
      textAlign(CENTER);
      fill(255);
      noStroke();
      text(this.centerText, this.width / 2, this.height / 2);
    }

    pop();
  }

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
       "class" : this.constructor.names
    };
    return objectJson;
  }
}

class LogicBattery extends Logic {
  constructor(x, y) {
    super("BATTERY", x, y, 0, 1);

    /* Logic Specific Attributes */
    this.maxPower = 100;
    this.minPower = -100;
    this.selectedPower = 0;
    /* Configure GUI */
    this.gui.add(this, 'selectedPower').min(this.minPower).max(this.maxPower).step(10);
  }

  /* Always apply configured power */
  prepareState() {
    if(this.power !== this.selectedPower) {
      this.nextState = new State(this.selectedPower);
      
    }
    // Set power to output socket
    if(this.power !== this.output[0].power) {
      this.output[0].setPower(this.power);
    }
  }

  draw() {
    this.centerText = this.power;
    super.draw();
  }

  toJson() {
    var objectJson = super.toJson();
    objectJson['power'] = this.power;
    return objectJson;
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
  prepareState() {
    if(this.bottomSocket.check()) {
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
    this.centerText = this.current/this.max + "%";
    super.draw();
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
  prepareState() {
    if(this.bottomSocket.check()) {
      this.current = 0;
      this.output[0].setPower(0);
    }

    if(this.inputs[0].check()) {
      this.current += this.inputs[0].power > 0 ? 1 : -1 ;
      if (this.current >= this.max) {
        this.current = this.max
        this.output[0].setPower(100);;
      } else if (this.current <= this.min) {
        this.current = this.min;
      } else {
        this.output[0].setPower(0);
      }
    }
  }

  draw() {
    this.centerText = this.current;
    super.draw();
  }

  toJson() {
    var objectData = super.toJson();
    objectData["current"] = this.current;
    objectData["max"] = this.max;
    objectData["min"] = this.min;
    return objectData;
  }
}

class LogicSelector extends Logic {
  constructor(x, y) {
    super("SELECTOR", x, y, 4, 4, true);

    /* Logic Specific Attributes */
    this.selected = 0;
    this.choices = 4;

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
  prepareState() {
    if(this.bottomSocket.check()) {
      this.output[this.selected].setPower(0);
      if(this.bottomSocket.power < 0) {
        this.selected -= 1;
        if (this.selected < 0) {
          this.selected = this.output.length - 1;
        }
      } else if (this.bottomSocket.power > 0) {
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

  toJson() {
    var objectData = super.toJson();
    objectData["selected"] = this.selected;
    objectData["choices"] = this.choices;
    return objectData;
  }
}

class LogicOr extends Logic {
  constructor(x, y) {
    super("OR", x, y, 2, 1);
  }

  /* When at least one input is on, send output */
  prepareState() {
    if(this.inputs[0].isOn() || this.inputs[1].isOn()) {
      this.output[0].setPower(max(this.inputs[0].power, this.inputs[1].power));
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
  prepareState() {
    if(this.inputs[0].isOn() && this.inputs[1].isOn()) {
      this.output[0].setPower(max(this.inputs[0].power, this.inputs[1].power));
    } else {
      this.output[0].setPower(0);
    }
  }
}

class LogicWaypoint extends Logic {
  constructor(x, y) {
    super("WAYPOINT", x, y, 1, 1);
  }

  /* Outputs the input */
  prepareState() {
    if(this.inputs[0].isOn()) {
      this.output[0].setPower(this.inputs[0].power);
    } else {
      this.output[0].setPower(0);
    }
  }
}

class LogicMeasure extends Logic {
  constructor(x, y) {
    super("MEASURE", x, y, 1, 0);
  }

  draw() {
    this.centerText = this.power;
    super.draw();
  }

  /* Outputs the input */
  prepareState() {
    if(this.inputs[0].power !== this.power) {
      this.nextState = new State(this.inputs[0].power);
    }
  }
}

class LogicXor extends Logic {
  constructor(x, y) {
    super("XOR", x, y, 2, 1);
  }

  /* When one and only one input is on, send output */
  prepareState() {
    if(this.inputs[0].isOn() != this.inputs[1].isOn()) {
      this.output[0].setPower(max(this.inputs[0].power, this.inputs[1].power));
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
  prepareState() {
    if(this.inputs[0].isOn() === false) {
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
  prepareState() {
    if(this.inputs[0].check()) {
      this.toggled = !this.toggled;
      this.output[0].setPower(this.toggled ? 100 : 0);
    }
  }

  toJson() {
    var objectData = super.toJson();
    objectData["toggled"] = this.toggled;
    return objectData;
  }
}

class LogicSplitter extends Logic {
  constructor(x, y) {
    super("SPLITTER", x, y, 1, 2);
  }
  
  /* Input splits negative and positve signal into two separate outputs */
  prepareState() {
    if(this.inputs[0].power > 0) {
      this.output[0].setPower(100);
      this.output[1].setPower(0);
    } else if (this.inputs[0].power < 0) {
      this.output[1].setPower(100);
      this.output[0].setPower(0);
    } else {
      this.output[0].setPower(0);
      this.output[1].setPower(0);
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
  prepareState() {
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
  prepareState() {
    if (KeyboardHandler.isCharPressed(this.key)) {
      this.output[0].setPower(100);
    } else {
      this.output[0].setPower(0);
    }
  }

  draw() {
    this.centerText = this.key;
    super.draw();
  }

  toJson() {
    var objectData = super.toJson();
    objectData["key"] = this.key;
    return objectData;
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
//     if (char(MouseHandler.pressedKey) == this.key) {
//       this.output[0].setPower(100);
//     } else {
//       this.output[0].setPower(0);
//     }
//   }
// }
