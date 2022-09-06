let kayak;
const SCALE = 2;
const COLORS = {};

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  COLORS.theme1 = color("#f8b2bc");
  COLORS.theme2 = color("#f5929f");
  COLORS.theme3 = color("#755bba");

  COLORS.theme1 = color("#459cc4");
  COLORS.theme2 = color("#daeff5");
  COLORS.theme3 = color("#1e6687");
  COLORS.kayak1 = color("#eee");

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
    this.movement = createVector(2, 0);
    this.direction = 0;
    this.magnitude = 0;
    this.wake = new DoubleWake(this);
    this.throttle = 1;
  }

  update() {
    // do not rotate directly, apply a force from the side
    if (keyIsPressed) {
      if (keyIsDown(LEFT_ARROW)) {
        this.movement.rotate(-0.01);
      }
      if (keyIsDown(RIGHT_ARROW)) {
        this.movement.rotate(0.01);
      }
    }

    this.position.add(this.movement);
    this.direction = this.movement.heading();
    this.magnitude = this.movement.mag();

    this.wake.update();
  }

  draw() {
    // shadow

    this.wake.draw();

    push();
    translate(this.position.x, this.position.y);
    fill(COLORS.kayak1);
    ellipse(0, 0, 20, 20);

    rotate(this.direction);

    // translate(-50.354, -18);

    // beginShape();
    // vertex(18.93, 37.749);

    // bezierVertex(55.156, 24.688, 94.573, 17.762, 142.3, 14.869);
    // bezierVertex(187.447, 13.525, 309.661, 28.99, 309.437, 41.586);
    // bezierVertex(309.22, 53.745, 209.837, 69.436, 147.268, 70.595);
    // bezierVertex(104.544, 71.386, 47.021, 58.906, 19.484, 50.2);
    // vertex(18.93, 37.749);

    // endShape();

    pop();
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

    const alpha = 255;
    fill(
      this.color.levels[0],
      this.color.levels[1],
      this.color.levels[2],
      alpha
    );
    stroke(
      this.color.levels[0],
      this.color.levels[1],
      this.color.levels[2],
      alpha
    );

    beginShape(QUAD_STRIP);

    for (let index = 0; index < this.trail1.particles.length; index++) {
      // const alpha = map(index, 0, this.trail1.particles.length, 255, 0);

      let particle = this.trail1.particles[index];
      vertex(particle.position.x, particle.position.y);
      // ellipse(particle.position.x, particle.position.y, 5, 5);

      particle = this.trail2.particles[index];
      vertex(particle.position.x, particle.position.y);
      // ellipse(particle.position.x, particle.position.y, 5, 5);
    }
    endShape();

    pop();
  }
}

class Trail {
  constructor(kayak, angle, waveHeight, acceleration) {
    this.kayak = kayak;
    this.maxParticles = 100;
    this.spawnRate = 2;
    this.particles = [];

    this.angle = angle;

    this.waveHeight = waveHeight;
    this.waveInterval = TWO_PI / 30;
    this.acceleration = acceleration;
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
    const direction = this.kayak.movement.copy().normalize().rotate(this.angle);
    const offset = p5.Vector.mult(direction, distance);

    const position = p5.Vector.add(this.kayak.position, offset);
    const movement = p5.Vector.mult(direction, this.acceleration);

    this.particles.push({
      position: position,
      movement: movement,
    });

    while (this.particles.length > this.maxParticles) {
      this.particles.shift();
    }
  }

  update() {
    if (frameCount % this.spawnRate === 0 && this.magnitude != 0) {
      this.add();
    }

    this.particles.forEach((particle) => {
      particle.position.add(particle.movement);
      particle.movement.mult(this.friction);
    });

    this.t += this.waveInterval;
  }
}
