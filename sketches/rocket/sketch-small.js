var font;
var vehicles = [];
var useFontSize = 200;
var fontBox;
var time;


function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}

function preload() {
  font = loadFont("fonts/Raleway/Raleway-Regular.ttf");
}

function setup() {
  var canvas = createCanvas(window.innerWidth, window.innerHeight);
  //canvas.parent('sketch-holder');
  textFont(font);

  colorMode(HSB, 100);
  time = nf(hour(), 2, 0) +  ":"  + nf(minute(), 2, 0) + ":" + nf(second(), 2, 0);
  changeWord(time);
}

function changeWord(s, instant) {
  points = font.textToPoints(s, width * .5, height * .5, useFontSize);
  b = font.textBounds("00:00:00", width * .5, height * .5, useFontSize);
  fontBox = b;

  removeV = 0;
  if (points.length < vehicles.length) {
    removeV = vehicles.length - points.length;
  }

  vehicles.splice(vehicles.length - removeV, removeV);


  points.forEach(function(p, index) {
    if(index >= vehicles.length) {
      if (vehicles.length == 0) {
          v = new Vehicle(p.x - b.w * .5, p.y + b.h * .5);
          vehicles.push(v);
      } else {
        last = vehicles[vehicles.length - 1];
        v = new Vehicle(last.pos.x, last.pos.y);
        vehicles.push(v);
      }

    }
    var vec = vehicles[index];
    vec.target.x = p.x - b.w * .5;
    vec.target.y = p.y + b.h * .5;

  }.bind(this));
}

function draw() {
  now = nf(hour(), 2, 0) +  ":"  + nf(minute(), 2, 0) + ":" + nf(second(), 2, 0);
  if (time != now) {
    time = now;
    changeWord(time, false);
  }

  //background(0, 100 * 0.5);
  background(0);

  // fill(255, 10);
  // vehicles.forEach(function(v) {
  //     ellipse(v.pos.x, v.pos.y, v.r * 7);
  // });

  vehicles.forEach(function(v) {
      v.behavior();
      v.update();
      v.render();
  });

}

function Vehicle(x, y) {
  //this.pos = createVector(random(width), random(height));
  this.pos = createVector(x, y);
  this.vel = createVector();
  this.acc = createVector();
  this.target = createVector(x, y);

  this.r = 8;
  this.maxSpeed = 2;
  this.maxForce = 0.8;
}

Vehicle.prototype.behavior = function() {
  target = createVector(0, 0);

  arrive = this.arrive(this.target);
  //flee = this.flee(target);

  arrive.mult(1);
  //flee.mult(2);

  this.applyForce(arrive);
  //this.applyForce(flee);
}

Vehicle.prototype.applyForce = function(f) {
  this.acc.add(f);
}

Vehicle.prototype.arrive = function(target) {
  desired = p5.Vector.sub(target, this.pos);
  d = desired.mag();
  speed = this.maxSpeed;
  if(d <= 600) {
    speed = map(d, 0, 100, 0, this.maxSpeed * 5);
  }
  desired.setMag(speed);
  steer = p5.Vector.sub(desired, this.vel);
  steer.limit(this.maxForce);
  return steer;
}

/* Vehicle.prototype.seek = function(target) {
  desired = p5.Vector.sub(target, this.pos);
  desired.setMag(this.maxSpeed);
  steer = p5.Vector.sub(desired, this.vel);
  steer.limit(this.maxForce);
  return steer;
} */

Vehicle.prototype.flee = function(target) {
  desired = p5.Vector.sub(target, this.pos);
  d = desired.mag();
  if(d < 150) {
    desired.setMag(this.maxSpeed);
    desired.mult(-1);
    steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    return steer;
  } else {
    return createVector(0, 0);
  }

}

Vehicle.prototype.update = function() {
  this.pos.add(this.vel);
  this.vel.add(this.acc);
  this.acc.mult(0);
}

Vehicle.prototype.render = function() {
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
  if(m <= 80) {
    m = 40;
  } else {
    m = 0;
  }

  // apply colors, lower saturation towards the center to create neon effect
  for (var i = this.r; i > 0; i-=4) {
    s = map(i, 0, this.r, 0, 100);
    fill(92 - c, s - d - m, 100);
    ellipse(this.pos.x, this.pos.y, i);
  }
}
