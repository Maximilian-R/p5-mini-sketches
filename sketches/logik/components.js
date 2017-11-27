/* Connect anything by
just extending a baseclass which has a socket. Then
override update method and define how your class should
behave to power.
*/

class Light extends InteractAble {
  constructor(x, y) {
    super(x, y);
    this.color = "#ffae23";
    this.on = false;
    this.width = 40;
    this.height = 40;
    this.input = this.addChild(new InputSocket(-this.width / 2, 0));

    this.gui = new dat.GUI();
    this.gui.addColor(this, 'color');
    this.gui.hide();
  }

  deselect() {
    this.gui.hide();
  }

  select() {
    this.gui.show();
  }

  isColliding(point) {
    if (this.pos.dist(point) < this.width * 1.1) return true;
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
    super.draw();
    push();
    translate(this.pos.x, this.pos.y);
    noStroke();
    if (this.on)  {
      fill(this.color);
    } else {
      fill(150);
    }
    rect(0, 0, this.width, this.height);
    pop();
  }

  remove() {
    //remove children
    this.input.remove();
    this.input = null;
    super.remove();
  }
}
