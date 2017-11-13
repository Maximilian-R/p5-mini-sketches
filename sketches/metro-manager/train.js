class Train {
  constructor(onLine) {
    this.line = onLine;
    this.direction = 1;

    this.atStation = this.line.getStation(0);
    this.from = this.atStation;
    this.to = this.atStation;
    this.onRail = this.atStation.getAnyRail(this.direction);
    this.x = this.atStation.x;
    this.y = this.atStation.y;

    this.color = this.line.color;
    this.speed = 4;
    this.time = 0;
    this.width = 30;
    this.height = 20;

    this.passengers = [];
    this.state = new WaitFor(10);
  }

  update() {
    this.time += 1;

    this.state.update(this);

    this.draw();
  }

  draw() {
    noStroke();
    fill(this.color);
    var angle = atan2(this.to.y - this.y, this.to.x - this.x);
    push();
    translate(this.x, this.y);
    rotate(angle);
    rect(0, 0, this.width, this.height);
    pop();
  }

  changeDirection() {
    this.direction *= -1;
  }
}

class Passenger {
  constructor() {
    this.money = 0;
    this.onTrain;
    this.onStation;
    this.goingToStation;
  }
}
