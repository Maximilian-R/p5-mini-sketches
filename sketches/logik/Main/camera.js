class Camera extends GameObject {
    constructor() {
      super(0, 0);
      this.dimension = new Dimension(window.innerWidth, window.innerHeight);
    }
  
    teleport(position) {
      this.position = position;
    }
  
    scroll(deltaX, deltaY) {
      this.position.x += deltaX;
      let maxX = mainHandler.world.position.x + mainHandler.world.dimension.width - this.dimension.width;
      let minX = mainHandler.world.position.x;
      if (this.position.x >= maxX) {
        this.position.x = maxX;
      } else if (this.position.x <= minX) {
        this.position.x = minX;
      }
  
      this.position.y += deltaY;
      let maxY = mainHandler.world.position.y + mainHandler.world.dimension.height - this.dimension.height;
      let minY = mainHandler.world.position.y;
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