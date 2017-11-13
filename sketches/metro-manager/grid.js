// Public function - button.mousePressed(cycleGrid) calls function, but not on instance (this)
function cycleGrid() {
  if (grid.gridType == null) {
    grid.gridType = new LineGrid();
  } else if (grid.gridType instanceof LineGrid) {
    grid.gridType = new PointGrid();
  } else if (grid.gridType instanceof PointGrid) {
    grid.gridType = null;
  }
}

class Grid {
  constructor() {
    this.gridType = null;
    this.mouse = new TrackMouse();

    var button = createButton('Grid Type');
    button.position(width - button.width, height - button.height);
    button.mousePressed(cycleGrid);

    var editButton = createButton('+');
    editButton.position(width - editButton.width, 0);
    editButton.mousePressed(cycleGrid);
  }

  update() {
    if(this.gridType instanceof GridType) {
      this.gridType.draw();
    }

    this.mouse.update();
    this.mouse.draw();
  }
}

class GridType {
  constructor() {
    this.mainColor = color(0);
    this.gridSize = 10;
    this.widthColumns = width / this.gridSize;
    this.heightColumns = height / this.gridSize;
  }

  draw() { print("This is not implemented"); }
}

class GridMouse extends GridType {
  constructor() {
    super();
    this.pointerSize = 10;
    this.x;
    this.y;
  }

  pressed() {

  }

  update() {
    var column = floor(mouseX / this.gridSize);
    var row = floor(mouseY / this.gridSize);
    let restX = mouseX % this.gridSize;
    let restY = mouseY % this.gridSize;
    if (restX >= this.gridSize/2) {
      column += 1;
    }
    if (restY >= this.gridSize/2) {
      row += 1;
    }
    this.x = column * this.gridSize;
    this.y = row * this.gridSize
  }

  draw() {
    stroke(this.mainColor);
    strokeWeight(this.pointerSize);
    point(this.x, this.y);
  }
}

class PointGrid extends GridType {
  constructor() {
    super();
    this.gridMarkerSize = 2;
  }

  draw() {
    stroke(this.mainColor);
    strokeWeight(this.gridMarkerSize);

    for (var i = 0; i < this.widthColumns; i++) {
      for (var j = 0; j < this.heightColumns; j++) {
        point(i * this.gridSize, j * this.gridSize);
      }
    }
  }
}

class LineGrid extends GridType {
  constructor() {
    super();
    this.lineSize = 1;
    this.startColor = color(66, 238, 244);
    this.endColor = color(12, 77, 79);
  }

  draw() {
    strokeWeight(this.lineSize);
    stroke(this.endColor);
    for (var i = 0; i < this.widthColumns; i++) {
      //stroke(lerpColor(this.startColor, this.endColor, i / this.widthColumns));
      var x = i * this.gridSize;
      line(x, 0, x, height);
    }
    for (var i = 0; i < this.heightColumns; i++) {
      //stroke(lerpColor(this.startColor, this.endColor, i / this.widthColumns));
      var y = i * this.gridSize;
      line(0, y, width, y);
    }
  }
}
