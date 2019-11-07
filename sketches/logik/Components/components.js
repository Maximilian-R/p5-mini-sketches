/* Connect anything by
just extending a baseclass which has a socket. Then
override update method and define how your class should
behave to power.
*/

class Light extends InteractAble {
  constructor(x, y) {
    super(x, y, new Dimension(SQUARE_SIZE, SQUARE_SIZE));
    this.color = "#ffae23";
    this.on = false;
    this.input = this.addChild(new InputSocket(-10, this.dimension.height / 2 - 5));

    this.gui = new dat.GUI();
    this.gui.addColor(this, 'color');
    this.gui.hide();
  }

  isColliding(point) {
    if (this.position.dist(point) < this.dimension.width * 1.1) return true;
    return false;
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
    rect(0, 0, this.dimension.width, this.dimension.height);
  }

  remove() {
    //remove children
    this.input.remove();
    this.input = null;
    super.remove();
  }
}
