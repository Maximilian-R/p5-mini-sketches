class Workspace {
    constructor() {
      this.position = createVector(0, 0);
      this.dimension = new Dimension(2000, 2000);
      this.camera = new Camera();
      this.editor = new Editor(this);
      //this.inventory = new Inventory(window.innerWidth - 240, 500);
    
      this.gameObjects = [];
    }
  
    addToWorld(gameObject) {
      this.gameObjects.push(gameObject);
      collisionNodes.push(gameObject);
      return gameObject;
    }
  
    positionInWorld(position) {
      return position.add(this.camera.position.copy());
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
      
      this.editor.draw();
      pop();
  
      // No longer in translate of camera, free to do things UI things... (static on screen)
      //this.inventory.draw();
    }
  
    update() {
      MouseHandler.update();
  
      if(frameCount % 2 === 0) {
        electricComponents.forEach((c) => {
          c.prepareState();
        });
        electricComponents.forEach((c) => {
          c.updateState();
        });
      }
  
      this.gameObjects.forEach((o) => {
        o.gameUpdate();
      });

      //this.inventory.update();
      
    }  
  }
  