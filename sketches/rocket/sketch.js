var font;
var vehicles = [];
var enemy;
var useFontSize = 200;
var fontBox;
var labels = [
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

  enemy = new Enemy(0, 0);
  word = labels[round(random(labels.length))];
  changeWord(word);
}

function draw() {
  background(0, 100 * 0.5);

  enemy.update();
  enemy.render();

  if (frameCount % 300 == 0) {
    changeWord(labels[floor(random(labels.length))]);
  }

  vehicles.forEach(function (v) {
    v.behavior();
    v.update();
    v.render();
  });
}

function changeWord(s) {
  points = font.textToPoints(s, width * 0.5, height * 0.5, useFontSize);
  b = font.textBounds(s, width * 0.5, height * 0.5, useFontSize);
  fontBox = b;

  removeV = 0;
  if (points.length < vehicles.length) {
    removeV = vehicles.length - points.length;
  }

  //Spread out from where vehicles are removed
  for (var i = 0; i <= removeV; i++) {
    rand = round(random(vehicles.length));
    vehicles.splice(rand, 1);
  }

  points.forEach(
    function (p, index) {
      if (index >= vehicles.length) {
        v = new Vehicle(p.x - b.w * 0.5, p.y + b.h * 0.5);
        v.pos.x = width / 2;
        v.pos.y = height / 2;
        vehicles.push(v);
      }
      vehicles[index].target.x = p.x - b.w * 0.5;
      vehicles[index].target.y = p.y + b.h * 0.5;
    }.bind(this)
  );
}

function Enemy(x, y) {
  this.x = x;
  this.y = y;
  this.speed = 8;
  this.r = 16;
  this.passed = false;
  this.index = 0;
  this.timePassed = 0;
}

Enemy.prototype.render = function () {
  noFill();
  for (var i = this.r; i > 0; i -= 4) {
    s = map(i, 0, this.r, 0, 100);
    fill(50, s, 100);
    ellipse(this.x, this.y, i);
  }
};

Enemy.prototype.update = function () {
  this.x = mouseX;
  this.y = mouseY;
  // this.timePassed++;
  // this.x += this.speed;
  //
  // if (this.x >= width && this.timePassed >= 60 * 4)  {
  //   this.x = 0;
  //   this.timePassed = 0;
  //   this.passed = false;
  // }
  //
  // if(this.x > width * 0.6 && !this.passed) {
  //   this.passed = true;
  //   newIndex = 0;
  //   do {
  //     newIndex = floor(random(labels.length));
  //   } while(newIndex == this.index);
  //
  //   this.index = newIndex;
  //   changeWord(labels[this.index]);
  // }
};

function Vehicle(x, y) {
  //this.pos = createVector(random(width), random(height));
  this.pos = createVector(x, y);
  this.vel = createVector();
  this.acc = createVector();
  this.target = createVector(x, y);

  this.r = 7;
  this.maxSpeed = 8;
  this.maxForce = 1;
}

Vehicle.prototype.behavior = function () {
  target = createVector(enemy.x, enemy.y);

  arrive = this.arrive(this.target);
  flee = this.flee(target);

  arrive.mult(1);
  flee.mult(2);

  this.applyForce(arrive);
  this.applyForce(flee);
};

Vehicle.prototype.applyForce = function (f) {
  this.acc.add(f);
};

Vehicle.prototype.arrive = function (target) {
  desired = p5.Vector.sub(target, this.pos);
  d = desired.mag();
  speed = this.maxSpeed;
  if (d <= 100) {
    speed = map(d, 0, 100, 0, this.maxSpeed * 5);
  }
  desired.setMag(speed);
  steer = p5.Vector.sub(desired, this.vel);
  steer.limit(this.maxForce);
  return steer;
};

/* Vehicle.prototype.seek = function(target) {
  desired = p5.Vector.sub(target, this.pos);
  desired.setMag(this.maxSpeed);
  steer = p5.Vector.sub(desired, this.vel);
  steer.limit(this.maxForce);
  return steer;
} */

Vehicle.prototype.flee = function (target) {
  desired = p5.Vector.sub(target, this.pos);
  d = desired.mag();
  if (d < 150) {
    desired.setMag(this.maxSpeed);
    desired.mult(-1);
    steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    return steer;
  } else {
    return createVector(0, 0);
  }
};

Vehicle.prototype.update = function () {
  this.pos.add(this.vel);
  this.vel.add(this.acc);
  this.acc.mult(0);
};

Vehicle.prototype.render = function () {
  noStroke();

  /*desired = p5.Vector.sub(this.target, this.pos);
  d = desired.mag();
  d = map(d, 0, 150, 0, 255);

  stroke(255, 255 - d * .5, 255 - d);
  if(random(0, 1) >= .5) {
    stroke(255, 255 - d, 255 - d);
  } */

  // calc color values from center and out
  d = this.pos.dist(createVector(this.pos.x, height / 2));
  d = map(d, 0, 80, 0, 50);
  c = map(d, 0, 80, 0, 100);

  // lighter value within mouse radius
  mp = createVector(mouseX, mouseY);
  m = this.pos.dist(mp);
  if (m <= 80) {
    m = 40;
  } else {
    m = 0;
  }

  // apply colors, lower saturation towards the center to create neon effect
  for (var i = this.r; i > 0; i -= 4) {
    s = map(i, 0, this.r, 0, 100);
    fill(92 - c, s - d - m, 100);
    ellipse(this.pos.x, this.pos.y, i);
  }
};
