class Grid {
    constructor() {
      this.position = createVector(200, 200);
      this.dimensions = new Dimension(SQUARE_SIZE * 10, SQUARE_SIZE * 10);
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
      stroke(220);
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