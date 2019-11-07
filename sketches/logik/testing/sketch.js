var workspace;
var debug = false;
const SQUARE_SIZE = 30;


/*
  on click, open GUI

  on hold, select for moving / pick up

*/

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  workspace = new Workspace();
  workspace.addToWorld(new Logic(2, 1));

  mouseHandler = new MouseHandler();
}

function draw() {
  background(255);

  workspace.draw();
  
}

class CollisionBody {
  constructor() {
    this.hover = false;
  }
}

class GameObject {
  constructor(position = createVector(0, 0), collision = false) {
    this.position = position;
    this.children = [];
    this.parent;
    this.collisionDetection = collision;
  }

  /* Converts from local to global position */
  getGlobalPosition() {
    if (this.parent != null) {
      return this.parent.getGlobalPosition().add(this.position.copy());
    }
    return this.position.copy();
  }

  addChild(child) {
    child.parent = this;
    this.children.push(child);
  }

  draw() {}
  
  update() {}

  gameDraw() {
    push();
    translate(this.position.x, this.position.y);
    this.draw();
    this.children.forEach((child) => {
      child.gameDraw();
    });
    pop();
  }

  gameUpdate() {
    this.update();
    this.children.forEach((child) => {
      child.gameUpdate();
    });
  }
}

class Dimension {
  constructor(w, h) {
    this.width = w;
    this.height = h;
  }
}

class Grid {
  constructor() {
    this.position = createVector(200, 200);
    this.dimensions = new Dimension(400, 400);
  }

  get gridSize() {
    return SQUARE_SIZE * 1;
  }

  snapToGrid(position) {
    let x = floor(position.x / this.gridSize) * this.gridSize;
    let y = floor(position.y / this.gridSize) * this.gridSize;
    return createVector(x, y);
  }

  draw() {
    push();
    translate(this.position.x, this.position.y);
    noFill();
    stroke(50);
    strokeWeight(1);

    // Center grid to position
    let offsetX = - this.dimensions.width / 2;
    let offsetY = - this.dimensions.height / 2;
    translate(offsetX, offsetY);

    // Draw grid lines
    for(let i = this.gridSize; i < this.dimensions.width; i += this.gridSize) {
      line(i, 0, i, this.dimensions.height);
    }
    for(let j = this.gridSize; j < this.dimensions.height; j += this.gridSize) {
      line(0, j, this.dimensions.width, j);
    }

    pop();
  }
}

class Editor {
  constructor(workspace) {
    this.workspace = workspace;
    this.cursor = createVector(0, 0);
    this.grid = new Grid();

    this.draggingObject;
  }

  mouseClicked() {
    let mouse = createVector(mouseY, mouseY);
    let positionInWorld = this.workspace.positionInWorld(mouse);
    let clickedObject = this.workspace.objectAtLocation(positionInWorld);
    this.draggingObject = clickedObject;
  }

  moveCursor(position) {
    this.cursor = this.grid.snapToGrid(position);
    this.grid.position = this.cursor;

    if (this.draggingObject != null) {
      this.draggingObject.position = this.workspace.positionInWorld(this.cursor.copy());
    }
  }

  draw() {
    //this.grid.draw();
    fill(0);
    ellipse(this.cursor.x, this.cursor.y,  10, 10);
  }
}

class Workspace extends GameObject {
  constructor() {
    super();
    this.dimension = new Dimension(2000, 2000);
    this.camera = new Camera();
    this.editor = new Editor(this);

    this.gameObjects = [];
  }

  addToWorld(gameObject) {
    this.gameObjects.push(gameObject);
  }

  positionInWorld(position) {
    return position.add(this.camera.position.copy());
  }

  objectAtLocation(position) {
    for (var i = 0; i < this.gameObjects.length; i++) {
      let gameObject = this.gameObjects[i];
      if ( position.x > gameObject.position.x
        && position.x < gameObject.position.x + gameObject.dimension.width
        && position.y > gameObject.position.y
        && position.y < gameObject.position.y + gameObject.dimension.height) {
          return gameObject;
      } else {
        return null;
      }
    }
  }

  draw() {
    push();
    translate(this.position.x, this.position.y);  
    this.camera.draw();
  
    push();
    // colored workspace background
    if (debug) {
      noStroke();
      for(var i = 0; i < this.dimension.width; i += this.dimension.width / 100) {
        for(var j = 0; j < this.dimension.height; j += this.dimension.height / 100) {
          var c1 = map(i, 0, this.dimension.width, 0, 255);
          var c2 = map(j, 0, this.dimension.height, 0, 255);
          fill(c1, 200, c2);
          rect(i, j, this.dimension.width / 100, this.dimension.height / 100);
        }
      }
    }

    this.gameObjects.forEach((o) => {
      o.gameDraw();
    });

    pop();
    pop();

    // No longer in translate of camera, free to do things UI things... (static on screen)
    this.editor.draw();
  }
}

class Camera extends GameObject {
  constructor() {
    super();
    this.dimension = new Dimension(window.innerWidth, window.innerHeight);
  }

  teleport(position) {
    this.position = position;
  }

  scroll(deltaX, deltaY) {
    this.position.x += deltaX;
    let maxX = workspace.position.x + workspace.dimension.width - this.dimension.width;
    let minX = workspace.position.x;
    if (this.position.x >= maxX) {
      this.position.x = maxX;
    } else if (this.position.x <= minX) {
      this.position.x = minX;
    }

    this.position.y += deltaY;
    let maxY = workspace.position.y + workspace.dimension.height - this.dimension.height;
    let minY = workspace.position.y;
    if (this.position.y >= maxY) {
      this.position.y = maxY;
    } else if (this.position.y <= minY) {
      this.position.y = minY;
    }
  }

  draw() {
    translate(-this.position.x, -this.position.y);
  }
}

const MIN_SIZE = 2;
class Logic extends GameObject {
  constructor(inputs = 0, outputs = 0) {
    super(createVector(SQUARE_SIZE * 4, SQUARE_SIZE * 4), true);

    this.size = new Dimension(0, 0);
    this.dimension = new Dimension(0, 0);

    this.input = [];
    this.output = [];

    this.backgroundColor = color('#2b3544');
    this.strokeColor = color('#3ea285');

    this.setup(inputs, outputs);
  }

  setup(inputs = 0, outputs = 0) {
    let maxSockets = max(inputs, outputs);

    this.size = new Dimension(2, max(MIN_SIZE, maxSockets));
    this.dimension = new Dimension(this.size.width * SQUARE_SIZE, this.size.height * SQUARE_SIZE);

    this.input = [];
    this.output = [];
    let inputOffset = inputs % 2 === 0 ? -SQUARE_SIZE * 0.5 : 0;
    for (let i = 0; i < inputs; i++) {
      let socket = new Socket();
      let y = inputOffset + SQUARE_SIZE * (i + 1) - socket.dimension.height / 2;
      let x = -socket.dimension.width;
      socket.position = createVector(x, y);
      this.addChild(socket);
      this.input.push(socket);
    }
    let outputOffset = outputs % 2 === 0 ? -SQUARE_SIZE * 0.5 : 0;
    for (let i = 0; i < outputs; i++) {
      let socket = new Socket();
      let y = outputOffset + SQUARE_SIZE * (i + 1) - socket.dimension.height / 2;
      let x = this.dimension.width;
      socket.position = createVector(x, y);
      this.addChild(socket);
      this.output.push(socket);
    }
  }

  draw() {
    push();
    
    fill(this.backgroundColor);
    stroke(this.strokeColor);
    strokeWeight(6);
    rect(0, 0, this.dimension.width, this.dimension.height, 10, 10);

    pop();
  }
}

class Socket extends GameObject {
  constructor(position) {
    super(position, true);
    this.dimension = new Dimension(10, 10);
    this.color = color('#2b3544');
  }

  draw() {
    push();
    fill(this.color);
    noStroke();
    rect(0, 0, this.dimension.width, this.dimension.height);
    pop();
  }
}

function mouseWheel(event) {
  workspace.camera.scroll(event.deltaX, event.deltaY);
}

function mouseClicked() {
  workspace.editor.mouseClicked();
}

function mouseMoved(event) {
  workspace.editor.moveCursor(createVector(event.x, event.y));
}

class DragAndDropHandler {
  constructor() {
    this.gameObject;
    //this.offset = createVector(0, 0);
  }

  /* 
    press & hold 1 second to select item
    now it will follow the mouse until a new click
    then place it there.

    

    mousePressed, start timer
    mouseReleased, cancel timer
    timer done, select item at location
    mouseMove, update item position
    mouseClicked, deselect item

  */

  mousePressed(nodes) {

    // check if any gameobject is at location...

    if (nodes[0] == null ||
      (nodes[0].parent != null && !(nodes[0] instanceof InventoryItem))) {
      return;
    }

    this.node = nodes[0];

    /* If it is a child node */
    if (this.node.parent != null) {
      this.offset = createVector(-this.node.parent.getGlobalPosition().x,
      -this.node.parent.getGlobalPosition().y);
    } else {
      this.offset = createVector(this.node.getGlobalPosition().x - mouseX,
      this.node.getGlobalPosition().y - mouseY);
    }
  }

  mouseDragged() {
    if (this.node == null) return
    this.node.pos = createVector(mouseX, mouseY).add(this.offset);
  }

  mouseReleased() {
    if (this.node == null) return
    this.node = null;
  }

  mouseMoved() {}
  mouseClicked() {}
  keyPressed() {}
}


var mouseHandler;
//function mouseClicked() { mouseHandler.mouseClicked(); }
//function mousePressed() { mouseHandler.mousePressed(); }
//function mouseReleased() { mouseHandler.mouseReleased(); }
//function mouseDragged() { mouseHandler.mouseDragged(); }
//function mouseMoved() { mouseHandler.mouseMoved(); }

class MouseHandler {
  constructor() {
    this.mouse = createVector(0, 0);
  }

  /* Mouse Input */
  mouseClicked() {
    //console.log("Mouse Clicked", mouseX, mouseY);
  }

  mousePressed() {
    //console.log("Mouse Pressed", mouseX, mouseY);
  }

  mouseReleased() {
    //console.log("Mouse Released", mouseX, mouseY);
  }

  mouseDragged() {
    //console.log("Mouse Dragged", mouseX, mouseY);
  }

  mouseMoved() {
    //console.log("Mouse Moved", mouseX, mouseY);
  }

  update() {
    this.mouse.x = mouseX;
    this.mouse.y = mouseY;
  }
}