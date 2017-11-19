/*

TODO: Logic Counter...
this need a togglesocket for input and reset.
Also it should be able to recive a negative signal to countdown.

Logic Toggle...
same here, but only togglesocket as input.


A normal socket is read by the logic to see what the power is.


If a togglescoket is read and has power, toggle something.
When a togglesocket is read, it sets a attribte to true.
This attribute is set to false when the socket is turned off.

insetad of reading the power, read if you should toggle.

A toggle socket should give power to the logic and toggle somthing,
then its should not be able to toggle until it has been reseted ( turned off)

*/


var logics = [];
var sockets = [];
var connections = [];
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
  logics.push(new LogicTimer(300, 100));
  logics.push(new LogicCounter(100, 100));

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

  for (var i = 0; i < connections.length; i++) {
    connections[i].draw();
  }
  for (var i = 0; i < logics.length; i++) {
    logics[i].update();
    logics[i].draw();
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
