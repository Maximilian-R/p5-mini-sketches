var logics = [];
var sockets = [];
var lights = [];
var editor;

function setup(){
  createCanvas(window.innerWidth, window.innerHeight);

  editor = new Editor();

  logics.push(new LogicOr(300, 300));
  logics.push(new LogicAnd(500, 300));
  logics.push(new LogicXor(700, 300));
  logics.push(new LogicBattery(100, 300));
  logics.push(new LogicBattery(500, 500));
  logics.push(new LogicNot(700, 500));
  logics.push(new LogicSelector(500, 100));

  lights.push(new Light(800, 300));
  lights.push(new Light(700, 50));
  lights.push(new Light(700, 100));
  lights.push(new Light(700, 150));


  var c1 = new Connection(logics[0].output[0], logics[1].inputs[0]);
  //var c2 = new Connection(logics[0].output[0], logics[1].inputs[1]);
  var c3 = new Connection(logics[1].output[0], logics[2].inputs[0]);
  var c4 = new Connection(logics[2].output[0], lights[0].input);
  var c3 = new Connection(logics[5].output[0], logics[2].inputs[1]);

  var b0 = new Connection(logics[3].output[0], logics[0].inputs[0]);
  var b1 = new Connection(logics[4].output[0], logics[1].inputs[1]);
  //var b2 = new Connection(logics[3].output[0], logics[5].inputs[0]);
//need advanced connection draw, dont collide in logic frames

  var l1 = new Connection(logics[6].output[0], lights[1].input);
  var l2 = new Connection(logics[6].output[1], lights[2].input);
  var l3 = new Connection(logics[6].output[2], lights[3].input);

}

function draw(){
  background(100);

  for (var i = 0; i < logics.length; i++) {
    logic = logics[i];
    logic.update();
    logic.draw();
  }
  for (var i = 0; i < lights.length; i++) {
    lights[i].update();
    lights[i].draw();
  }

  editor.update();
  editor.draw();

}

class PlaceAble {
  constructor(x, y) {
    this.pos = createVector(x, y);
  }
}

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

    var pxPerInput = this.height / inputCount;
    var pxPerOutput = this.height / outputCount;

    // om 1= 60px, 2 = 30px var. Placer i mitten av dessa
    // om 3, 90px, 30 30 30. Placera 15, 45, 75
    for (var i = 0; i < inputCount; i++) {
      var x = this.pos.x - this.width / 2;
      var y = (this.pos.y - this.height / 2) + (pxPerInput * i) + (pxPerInput / 2);
      this.inputs.push(new InputSocket(x, y));
    }

    for (var i = 0; i < outputCount; i++) {
      var x = this.pos.x + this.width / 2;
      var y = (this.pos.y - this.height / 2) + (pxPerOutput * i) + (pxPerOutput / 2);
      this.output.push(new OutputSocket(x, y));
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

class Socket {
  constructor(x, y) {
    this.pos = createVector(x, y);
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
    // Input Always have 1 or 0
    for (var i = 0; i < this.connections.length; i++) {
      this.on = this.connections[i].isOn();
    }
  }

  connect(connection) {
    if(this.connections[0] != null) {
      //remove from other socket and delete old connection
    }
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
    this.input = input;
    this.output = output;
    this.input.connect(this);
    this.output.connect(this);
    this.on = false;
    this.thickness = 8;
  }

  isOn() { return this.on }
  update() { this.on = this.input.isOn(); }

  draw() {
    if (this.on) {
      stroke(45, 250, 142);
    } else {
      stroke(0, 100, 0);
    }
    strokeCap(PROJECT);
    strokeWeight(this.thickness);
    noFill();

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


// straight line
//    line(this.input.pos.x, this.input.pos.y, this.output.pos.x, this.output.pos.y);
  }
}

class Light extends PlaceAble {
  constructor(x, y) {
    super(x, y);
    this.color = color(255, 243, 79);
    this.on = false;
    this.width = 40;
    this.height = 40;
    this.input = new InputSocket(this.pos.x - this.width / 2, this.pos.y);
  }

  update() {
    if(this.input.isOn() == true ) {
      this.on = true;
    } else {
      this.on = false;
    }

    this.input.update();
  }

  draw() {
    noStroke();
    if (this.on)  {
      fill(this.color);
    } else {
      fill(150);
    }
    rect(this.pos.x, this.pos.y, this.width, this.height);

    this.input.draw();
  }
}
