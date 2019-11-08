/* Connect anything by
just extending a baseclass which has a socket. Then
override update method and define how your class should
behave to power.
*/

class Light extends GameObject {
  constructor(x, y) {
    let p = world.editor.grid.snapToGrid(createVector(x, y));
    super(p.x, p.y);
    this.size = new Dimension(SQUARE_SIZE, SQUARE_SIZE);
    this.collider = new ColliderBox(this, this.size);

    this.color = "#ffae23";
    this.on = false;
    this.input = this.addChild(new InputSocket(-10, this.size.height / 2 - 5));

    this.gui = new dat.GUI();
    this.gui.addColor(this, 'color');
    this.gui.hide();
  }

  update() {
    super.update();

    if(this.input.isOn()) {
      this.on = true;
    } else {
      this.on = false;
    }
  }

  draw() {
    noStroke();
    if (this.on)  {
      fill(this.color);
    } else {
      fill(150);
    }
    rect(0, 0, this.size.width, this.size.height);
  }

  remove() {
    //remove children
    this.input.remove();
    this.input = null;
    super.remove();
  }
}
