class Light extends PlaceAble {
  constructor(x, y) {
    super(x, y);
    this.color = color(255, 243, 79);
    this.on = false;
    this.width = 40;
    this.height = 40;
    this.input = new InputSocket(this.pos.x - this.width / 2, this.pos.y);
  }

  update() {
    if(this.input.isOn() == true ) {
      this.on = true;
    } else {
      this.on = false;
    }
    this.input.update();
  }

  draw() {
    noStroke();
    if (this.on)  {
      fill(this.color);
    } else {
      fill(150);
    }
    rect(this.pos.x, this.pos.y, this.width, this.height);

    this.input.draw();
  }
}
