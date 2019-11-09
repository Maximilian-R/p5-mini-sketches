let mainHandler;

/* 
  gameobject handler
  electric handler 

  ui
  workspace

  editor | works with the workspace and ui
*/ 

class Main {
  constructor() {
    this.mouseHandler;
    this.keyboardHandler;
    this.collisionHandler;
    this.electricHandler;
    this.world;

    this.inventory;
  }

  setup() {
    this.mouseHandler = new MouseHandlerClass();
    this.mouseHandler.subscribe(new DragAndDrop());

    this.keyboardHandler = new KeyboardHandlerClass();
    this.collisionHandler = new CollisionHandlerClass();
    this.electricHandler = new ElectricHandler();
    this.world = new Workspace();

    this.inventory = new Menu();
  }

  update() {
    this.mouseHandler.update();
    this.electricHandler.update();
    this.world.update();
  }

  draw() {
    this.world.draw();
    this.inventory.draw();
  }
}

class ElectricHandler {
  constructor() {
    this.refreshRate = 2;
    this.components = [];
  }

  add(eletric) {
    this.components.push(eletric);
  }

  update() {
    if(frameCount % this.refreshRate === 0) {
      this.components.forEach((c) => {
        c.prepareState();
      });
      this.components.forEach((c) => {
        c.updateState();
      });
    }
  }
}


var inventory;

var debug = false;
const SQUARE_SIZE = 30;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  rectMode(CORNER);

  mainHandler = new Main();
  mainHandler.setup();
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

  mainHandler.update();
  mainHandler.draw();
}

function setupTestData() {
  let classes = [LogicOr, LogicAnd, LogicXor, LogicTimer, LogicNot, LogicSelector, LogicSwitch,
  LogicBattery, LogicCounter, LogicCombiner, LogicSplitter, LogicKeyInput, LogicWaypoint, LogicMeasure];

  for(let i = 0; i < classes.length; i++) {
    let x = SQUARE_SIZE + (SQUARE_SIZE * 3 * i);
    for(let j = 0; j < 3; j++) {
      let y = SQUARE_SIZE + (SQUARE_SIZE * 3 * j);
      mainHandler.world.addToWorld(new classes[i](x, y));
    }
  }

  for (let i = 0; i < 10; i++) {
    let x = SQUARE_SIZE + (SQUARE_SIZE * 2 * i);
    let y = window.innerHeight - SQUARE_SIZE * 2;
    mainHandler.world.addToWorld(new Light(x, y));
  }
}