var world;

var inventory;
var MouseHandler;
var KeyboardHandler;

var electricComponents = [];
var collisionNodes = [];

var menu;

var debug = false;
const SQUARE_SIZE = 30;

function setup(){
  createCanvas(window.innerWidth, window.innerHeight);

  rectMode(CORNER);
  
  MouseHandler = new MouseHandlerClass();
  MouseHandler.subscribe(new DragAndDrop());

  KeyboardHandler = new KeyboardHandlerClass();

  world = new Workspace();

  setupTestData();

  classes = {
    "LogicOr" : LogicOr,
    "LogicAnd" : LogicAnd,
    "LogicNot" : LogicNot,
    "LogicXor" : LogicXor,
    "LogicBattery" : LogicBattery,
    "LogicTimer" : LogicTimer,
    "LogicCounter" : LogicCounter,
    "LogicSelector" : LogicSelector,
    "LogicSwitch" : LogicSwitch,
    "LogicSplitter" : LogicSplitter,
    "LogicCombiner" : LogicCombiner,
    "LogicKeyInput" : LogicKeyInput,
    "Light" : Light
  };
}

function draw(){
  background(180);

  // Bug?? if not setting every time it will become center on mpouse move, wtf...
  rectMode(CORNER);

  world.update();
  world.draw();
}

function setupTestData() {
  let classes1 = [LogicOr, LogicAnd, LogicXor, LogicTimer, LogicNot, LogicSelector,
  LogicBattery, LogicCounter, LogicCombiner, LogicSplitter, LogicKeyInput, LogicWaypoint, Light, LogicMeasure];

  
  let classes = [LogicBattery];

  for(let i = 0; i < classes.length; i++) {
    let x = SQUARE_SIZE + (SQUARE_SIZE * 3 * i);
    for(let j = 0; j < 3; j++) {
      let y = SQUARE_SIZE + (SQUARE_SIZE * 3 * j);
      world.addToWorld(new classes[i](x, y));
    }
  }

  

}

function resetPlayground() {
  for (var i = world.gameObjects.length - 1; i >= 0; i--) {
    world.gameObjects[i].remove();
  }

  world.gameObjects.push(inventory);
} 