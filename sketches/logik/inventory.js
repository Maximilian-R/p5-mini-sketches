class Inventory {
  constructor(x, y) {
    this.width = 240;
    this.height = 160;

    if(x + this.width / 2 > width) {
      x = width - this.width / 2;
    }
    if(y + this.height / 2 > height) {
      y = height - this.height / 2;
    }
    this.pos = createVector(x, y);

    this.items = [
      new InventoryItem(createVector(x, y), LogicAnd, "AND"),
      new InventoryItem(createVector(x, y), LogicOr, "OR"),
      new InventoryItem(createVector(x, y), LogicNot, "NOT"),
      new InventoryItem(createVector(x, y), LogicXor, "XOR"),
      new InventoryItem(createVector(x, y), LogicTimer, "TIMER"),
      new InventoryItem(createVector(x, y), LogicCounter, "COUNTER"),
      new InventoryItem(createVector(x, y), LogicSelector, "SELECTOR"),
      new InventoryItem(createVector(x, y), LogicBattery, "BATTERY"),
      new InventoryItem(createVector(x, y), LogicToggle, "TOGGLE")
    ];

    this.drag();
  }

  drag() {
    var x = this.items[0].width / 2;
    var y = this.items[0].height / 2;
    for (var i = 0; i < this.items.length; i++) {
      var item = this.items[i];
      item.initPos.x = this.pos.x - this.width / 2 + x;
      item.initPos.y = this.pos.y - this.height / 2 + y;
      item.pos = item.initPos;
      x += item.width;
      if(x + item.width/2 > this.width) {
        y += 40;
        x = 40;
      }
    }
  }

  draw() {
    rectMode(CENTER);
    fill(170);
    stroke(255);
    strokeWeight(4);
    rect(this.pos.x, this.pos.y, this.width, this.height);

    for (var i = 0; i < this.items.length; i++) {
      this.items[i].draw();
    }
  }
}

class InventoryItem extends DragAndDropAble {
  constructor(initPos, logicClass, text) {
    super(initPos.x, initPos.y);
    this.initPos = initPos;
    this.pos = this.initPos;
    this.logicClass = logicClass;
    this.text = text;
    this.color = color(255);
    this.width = 80;
    this.height = 40;
    this.frameColor = color(255);
  }

  draw() {
    rectMode(CENTER);
    textAlign(CENTER);

    fill(170);
    stroke(this.frameColor);
    rect(this.pos.x, this.pos.y, this.width, this.height);

    noStroke();
    fill(255);
    text(this.text, this.pos.x, this.pos.y);
  }

  startHover() { this.highlight() }
  endHover() { this.noHighlight() }
  highlight() { this.frameColor = color(112, 2, 124); }
  noHighlight() { this.frameColor = color(255); }

  drop() {
    new this.logicClass(mouseX, mouseY);
    this.pos = this.initPos;
    this.frameColor = color(255);
  }
}
