let kayak;
const SCALE = 1;
const COLORS = {};

let img;
function preload() {
  img = loadImage("./kayak.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  COLORS.theme1 = color("#f8b2bc");
  COLORS.theme2 = color("#f5929f");
  COLORS.theme3 = color("#755bba");

  COLORS.theme1 = color("#7fd2f5");
  COLORS.theme2 = color("#daeff5");
  COLORS.theme3 = color("#1c6b8c");
  COLORS.kayak1 = color("#eee");
  COLORS.bird1 = color("#fff");
  COLORS.bird2 = color("#f5b342");

  kayak = new Kayak(createVector(0, height / 2));
}

function draw() {
  background(COLORS.theme1);

  // ZOOM in close on kayak and translate to move along

  translate(
    width / 2 - kayak.position.x * SCALE,
    height / 2 - kayak.position.y * SCALE
  );
  scale(SCALE);

  kayak.update();
  kayak.draw();
}

class Kayak {
  constructor(position) {
    this.position = position;
    this.velocity = createVector(3, 0);
    // this.acceleration = createVector(0, 0);
    this.turnSpeed = 0.01;

    this.wake = new DoubleWake(this);
    this.birds = new Birds(this.position);
  }

  update() {
    // do not rotate directly, apply a force from the side
    if (keyIsPressed) {
      if (keyIsDown(LEFT_ARROW)) {
        this.velocity.rotate(-this.turnSpeed);
      }
      if (keyIsDown(RIGHT_ARROW)) {
        this.velocity.rotate(this.turnSpeed);
      }
    }

    this.position.add(this.velocity);
    // this.acceleration.set(0, 0);

    this.wake.update();
    this.birds.update();
  }

  draw() {
    this.wake.draw();

    push();

    translate(this.position.x, this.position.y);
    rotate(this.velocity.heading());
    fill(COLORS.kayak1);
    //ellipse(0, 0, 20, 20);

    scale(0.25);
    translate(-img.width / 2, -img.height / 2);

    image(img, 0, 0);

    pop();

    this.birds.draw();
  }
}

class DoubleWake {
  constructor(kayak) {
    this.wake1 = new Wake(kayak, 8, 1.2, COLORS.theme2);
    this.wake2 = new Wake(kayak, 4, 0.6, COLORS.theme3);
  }

  update() {
    this.wake1.update();
    this.wake2.update();
  }

  draw() {
    this.wake1.draw();
    this.wake2.draw();
  }
}

class Wake {
  constructor(kayak, waveHeight, acceleration, wakeColor) {
    this.kayak = kayak;
    this.color = wakeColor;
    this.trail1 = new Trail(kayak, HALF_PI, waveHeight, acceleration);
    this.trail2 = new Trail(kayak, -HALF_PI, waveHeight, acceleration);
  }

  update() {
    this.trail1.update();
    this.trail2.update();
  }

  draw() {
    push();
    strokeWeight(1);

    fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], 255);
    stroke(
      this.color.levels[0],
      this.color.levels[1],
      this.color.levels[2],
      255
    );

    beginShape(TRIANGLE_STRIP);
    for (let index = 0; index < this.trail1.particles.length; index++) {
      const particle1 = this.trail1.particles[index];
      const particle2 = this.trail2.particles[index];

      vertex(particle1.position.x, particle1.position.y);
      vertex(particle2.position.x, particle2.position.y);

      // ellipse(particle1.position.x, particle1.position.y, 5, 5);
      // ellipse(particle2.position.x, particle2.position.y, 5, 5);
    }

    endShape();

    pop();
  }
}

class Trail {
  constructor(kayak, angle, waveHeight, initialForce) {
    this.kayak = kayak;
    this.maxParticles = 50;
    this.spawnRate = 4;
    this.particles = [];

    this.angle = angle;
    this.waveHeight = waveHeight;
    this.waveInterval = TWO_PI / 50;
    this.initialForce = initialForce;
    this.friction = 0.98;
    this.t = 0;
  }

  add() {
    const distance = map(
      sin(this.t),
      0,
      1,
      this.waveHeight * 0.5,
      this.waveHeight
    );
    const direction = this.kayak.velocity.copy().normalize().rotate(this.angle);
    const offset = p5.Vector.mult(direction, distance);

    const position = p5.Vector.add(this.kayak.position, offset);
    const velocity = p5.Vector.mult(direction, this.initialForce);

    this.particles.push({
      position: position,
      velocity: velocity,
    });

    while (this.particles.length > this.maxParticles) {
      this.particles.shift();
    }
  }

  update() {
    if (frameCount % this.spawnRate === 0) {
      this.add();
    }

    this.particles.forEach((particle) => {
      particle.position.add(particle.velocity);
      particle.velocity.mult(this.friction);
    });

    this.t += this.waveInterval;
  }
}

class Birds {
  constructor(target) {
    this.birds = [];
    this.birds.push(
      new Bird(createVector(0, 0), target, createVector(-50, 40))
    );
    this.birds.push(
      new Bird(createVector(0, 0), target, createVector(-20, -40))
    );
    this.birds.push(
      new Bird(createVector(0, 0), target, createVector(60, -80))
    );
  }

  update() {
    this.birds.forEach((bird) => bird.update());
  }

  draw() {
    this.birds.forEach((bird) => bird.draw());
  }
}

class Bird {
  constructor(position, target, offset) {
    this.position = position;
    this.target = target;
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.maxSpeed = 2.1;
    this.maxForce = 0.01;

    // only applied visually
    this.offset = offset;

    this.t = 0;
  }

  seek() {
    const force = p5.Vector.sub(this.target, this.position)
      .setMag(this.maxSpeed)
      .sub(this.velocity)
      .limit(this.maxForce);

    this.acceleration.add(force);
  }

  update() {
    this.seek();

    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.set(0, 0);

    this.t += 0.1;
  }

  draw() {
    noStroke();
    push();
    translate(this.position.x, this.position.y);
    translate(this.offset.x, this.offset.y);
    rotate(this.velocity.heading());
    scale(1);

    strokeWeight(2);
    stroke(COLORS.bird2);
    line(30, 0, 34, 0);

    stroke("#000");
    strokeWeight(3);
    point(28, -2);
    point(28, 2);

    fill(COLORS.bird1);
    stroke(COLORS.bird1);
    strokeWeight(4);
    strokeJoin(ROUND);
    triangle(0, -5, 0, 5, 30, 0);

    const wings = map(sin(this.t), 0, 1, 8, 10);
    strokeWeight(10);
    line(20, -wings, 20, wings);

    pop();
  }
}
