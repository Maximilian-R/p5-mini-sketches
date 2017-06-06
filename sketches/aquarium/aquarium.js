var fishes = [];
var animations = [];

function setup(){
  var canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch');

  start();
}

function start() {
  fishes = [];
  for (var i = 0; i < 3; i++) {
    c1 = color(54, 209, 255).levels;
    c2 = color(c1[0] * 1.1, c1[1] * 1.1, c1[2] * 1.1).levels;
    fish = new Fish(windowWidth * random(0, 1), windowHeight * random(0, 1), c1, c2);
    fishes.push(fish);
  }
}

function draw(){
  background(0, 0, 50);

  fishes.forEach(function(f) {
    f.update(frameCount * 0.1);
    f.render();
  });

  animations.forEach(function(a) {
    a.update(frameCount * 0.1);
    a.render();
  });

  if (animations[0]) {
    if (!animations[0].active) {
      animations.splice(0, 1);
    }
  }

}

function mouseClicked() {
  if (mouseY > 0 && mouseY < height) {
    d = new DopplerAnimation(mouseX, mouseY);
    animations.push(d);
  }
}

function Fish(x, y, c1, c2) {
  this.x = x;
  this.y = y;
  this.bubbles = [];
  this.counter = 0;

  //this.from = color(255, 0, 255, 0.2 * 255);
  //this.to = color(0, 255, 255, 0.2 * 255);
  this.from = color(c1[0], c1[1], c1[2], 0.2 * 255);
  this.to = color(c2[0], c2[1], c2[2], 0.2 * 255);

  this.nx = random(10);
  this.ny = random(10);

  this.MAX_SPEED = 10;
}

Fish.prototype.update = function(t) {

  if (animations.length > 0) {
    d = animations[animations.length - 1];
    vx = (d.x - this.x) * 0.06;
    vy = (d.y - this.y) * 0.06;
    this.x += vx;
    this.y += vy;
  } else {
  //velocity
  lerpX = lerp(-this.MAX_SPEED, this.MAX_SPEED, noise(this.ny, this.nx));
  lerpY = lerp(-this.MAX_SPEED, this.MAX_SPEED, noise(this.nx, this.ny));
  this.x += lerpX;
  this.y += lerpY;
  this.x = constrain(this.x, 0, width);
  this.y = constrain(this.y, 0, height);
  nLerp = lerp(0, 0.01,  noise(this.counter));
  this.nx += nLerp;
  this.ny += nLerp;
  }

  //bubble creation
  r = noise(t) * 40;
  c = lerpColor(this.from, this.to, random(0, 1));
  b = new Bubble(this.x, this.y, r, this.counter++, c);
  this.bubbles.push(b);

  //update bubbles
  this.bubbles.forEach(function(b, index) {
    b.update(t);

    if (b.r <= 0) {
      this.bubbles.splice(index, 1);
    }
  }.bind(this));

}

Fish.prototype.render = function() {

  this.bubbles.forEach(function(b) {
    b.render();
  });

}

function Bubble(x, y, r, index, c) {
  this.x = x;
  this.y = y;
  this.c = c;
  this.r = r;
  this.index = index;
}

Bubble.prototype.update = function(t) {
  this.r -= 0.2;
  this.x += (sin(t + this.index) + map(noise(t, this.index), 0, 1, -2, 2));
  this.y += (cos(t + this.index) + map(noise(t, this.index), 0, 1, -2, 2));
}

Bubble.prototype.render = function() {
  noStroke();
  fill(this.c);
  ellipse(this.x, this.y, this.r + 2);
  fill(this.c);
  ellipse(this.x, this.y, this.r);
}

function DopplerAnimation(x, y) {
  this.x = x;
  this.y = y;
  this.dopplers = [];
  this.active = true;
  this.spawnDelay = 0;
  this.amount = 3;
}

DopplerAnimation.prototype.update = function(t) {

  if(this.amount > 0 && this.spawnDelay-- <= 0) {
    this.amount--;
    this.addDoppler();
    this.spawnDelay = 20;
  }

  this.dopplers.forEach(function(d, index) {
    d.update(t);
    if(d.alpha <= 0) {
      this.dopplers.splice(index, 1);
    }
  }.bind(this));

  if (this.dopplers.length == 0 ) {
    this.active = false;
  }
}

DopplerAnimation.prototype.render = function() {
  this.dopplers.forEach(function(d, index) {
    d.render();
  });
}

DopplerAnimation.prototype.addDoppler = function() {
  d = new Doppler(this.x, this.y);
  this.dopplers.push(d);
}

function Doppler(x, y) {
  this.x = x;
  this.y = y;
  this.r = 0;
  this.alpha = 255;
}

Doppler.prototype.update = function(t) {
  this.r += 2;
  this.alpha -= 3;
}

Doppler.prototype.render = function() {
  noFill();
  stroke(54, 209, 255, this.alpha);
  strokeWeight(2);
  ellipse(this.x, this.y, this.r);
}
