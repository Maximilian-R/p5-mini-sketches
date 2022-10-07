let font;
let vehicles = [];
let enemy;
const fontSize = 200;
const wordList = [
  "Algorithm",
  "Array",
  "Boolean",
  "Block",
  "Bracket",
  "Binary",
  "Class",
  "10110",
  "Complie",
  "Concat",
  "Catch",
  "Datatype",
  "Debug",
  "Declare",
  "Double",
  "Element",
  "Error",
  "Escape",
  "Event",
  "Foreach",
  "Float",
  "Function",
  "HTML",
  "Integer",
  "Java",
  "Label",
  "Method",
  "Null",
  "Parse",
  "Private",
  "Public",
  "Program",
  "Random",
  "Return",
  "Server",
  "Shift",
  "Source",
  "Stack",
  "Switch",
  "Swift",
  "String",
  "Super",
  "System",
  "Thread",
  "Value",
];

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function preload() {
  font = loadFont("./Raleway-Regular.ttf");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);

  textFont(font);
  colorMode(HSB, 100);
  noCursor();
  noStroke();

  enemy = new Enemy(0, 0);
  changeWord();
}

function draw() {
  background(0, 50);

  enemy.update();

  if (frameCount % 300 == 0) {
    changeWord();
  }

  vehicles.forEach((vehicle) => {
    vehicle.behavior();
    vehicle.update();
    vehicle.draw();
  });

  enemy.draw();
}

function changeWord() {
  const word = wordList[floor(random(wordList.length))];
  const points = font.textToPoints(word, width * 0.5, height * 0.5, fontSize);
  const bounds = font.textBounds(word, width * 0.5, height * 0.5, fontSize);

  //Spread out removal of vehicles when there is an overflow
  const removeVehicles = vehicles.length - points.length;
  for (var i = 0; i <= removeVehicles; i++) {
    const removeIndex = floor(random(vehicles.length));
    vehicles.splice(removeIndex, 1);
  }

  points.forEach((point, index) => {
    // Spawn a new vehicle if needed
    if (index >= vehicles.length) {
      const vehicle = new Vehicle(
        point.x - bounds.w * 0.5,
        point.y + bounds.h * 0.5
      );
      vehicle.pos.x = width / 2;
      vehicle.pos.y = height / 2;
      vehicles.push(vehicle);
    }

    vehicles[index].target.x = point.x - bounds.w * 0.5;
    vehicles[index].target.y = point.y + bounds.h * 0.5;
  });
}

class Enemy {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.r = 16;
  }

  draw() {
    for (let i = this.r; i > 0; i -= 4) {
      const saturation = map(i, 0, this.r, 0, 100);
      fill(50, saturation, 100);
      ellipse(this.pos.x, this.pos.y, i);
    }
  }

  update() {
    this.pos.x = mouseX;
    this.pos.y = mouseY;
  }
}

class Vehicle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();
    this.target = createVector(x, y);

    this.r = 7;
    this.maxSpeed = 8;
    this.maxForce = 1;
  }

  behavior() {
    const arrive = this.arrive(this.target);
    const flee = this.flee(enemy.pos);

    // arrive.mult(1);
    flee.mult(2);

    this.applyForce(arrive);
    this.applyForce(flee);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  arrive(target) {
    const desired = p5.Vector.sub(target, this.pos);
    const d = desired.mag();
    let speed = this.maxSpeed;
    if (d <= 100) {
      speed = map(d, 0, 100, 0, this.maxSpeed * 5);
    }
    desired.setMag(speed);
    const steer = p5.Vector.sub(desired, this.vel).limit(this.maxForce);
    return steer;
  }

  flee(target) {
    const desired = p5.Vector.sub(target, this.pos);
    const d = desired.mag();
    if (d < 150) {
      desired.setMag(this.maxSpeed).mult(-1);
      const steer = p5.Vector.sub(desired, this.vel).limit(this.maxForce);
      return steer;
    } else {
      return createVector(0, 0);
    }
  }

  update() {
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.acc.mult(0);
  }

  draw() {
    // Calculate color values from center and out
    let d = this.pos.dist(createVector(this.pos.x, height / 2));
    d = map(d, 0, 80, 0, 50);
    const c = map(d, 0, 80, 0, 100);

    // Apply colors, lower saturation towards the center to create neon effect
    for (let i = this.r; i > 0; i -= 4) {
      const saturation = map(i, 0, this.r, 0, 100);
      fill(92 - c, saturation - d, 100);
      ellipse(this.pos.x, this.pos.y, i);
    }
  }
}

/* Vehicle.prototype.seek = function(target) {
  desired = p5.Vector.sub(target, this.pos);
  desired.setMag(this.maxSpeed);
  steer = p5.Vector.sub(desired, this.vel);
  steer.limit(this.maxForce);
  return steer;
} */
