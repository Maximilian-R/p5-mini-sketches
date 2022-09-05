let kayak;
const SCALE = 3;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  kayak = new Kayak();
}

function draw() {
  background("#f8b2bc");

  //kayak.goTo(createVector(mouseX, mouseY));

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
  constructor() {
    this.position = createVector(100, height / 2);
    this.lastPosition = this.position.copy();
    this.movement = createVector(2, 0);
    this.wake = new Wake(this, 6, color("#f5929f"));
    this.wake2 = new Wake(this, 3, color("#755bba"));
    this.throttle = 1;
  }

  goTo(position) {
    this.lastPosition = this.position.copy();
    this.position = position;
    this.movement = p5.Vector.sub(this.position, this.lastPosition);
  }

  rotate(angle) {
    this.movement.rotate(angle);
  }

  update() {
    if (keyIsPressed) {
      if (keyIsDown(LEFT_ARROW)) {
        this.rotate(-0.03);
      }
      if (keyIsDown(RIGHT_ARROW)) {
        this.rotate(0.03);
      }
    }

    this.position.add(this.movement);
    this.wake.update();
    this.wake2.update();
  }

  draw() {
    //shadow
    // push();
    // translate(this.position.x, this.position.y);
    // fill(0, 0, 10);
    // ellipse(5, 10, 20, 20);
    // pop();

    this.wake.draw();
    this.wake2.draw();

    push();
    translate(this.position.x, this.position.y);
    fill(255, 255, 255);
    ellipse(0, 0, 20, 20);
    pop();
  }
}

class Wake {
  constructor(kayak, spread, wakeColor) {
    this.kayak = kayak;
    this.color = wakeColor ?? color(255);
    this.spread = spread ?? 5;
    this.trail1 = new Trail(kayak, HALF_PI, this.spread);
    this.trail2 = new Trail(kayak, -HALF_PI, this.spread);
  }

  update() {
    this.trail1.update();
    this.trail2.update();

    this.angle += TWO_PI / 50;
  }

  draw() {
    if (this.trail1.particles.length == 0 || this.trail2.particles.length == 0)
      return;

    push();
    strokeWeight(1);
    beginShape(QUAD_STRIP);

    for (let index = 0; index < this.trail1.particles.length; index++) {
      // const alpha = map(index, 0, this.trail1.particles.length, 255, 0);
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

      let particle = this.trail1.particles[index];
      vertex(particle.position.x, particle.position.y);
      //ellipse(particle.position.x, particle.position.y, 5, 5);

      particle = this.trail2.particles[index];
      vertex(particle.position.x, particle.position.y);
      //ellipse(particle.position.x, particle.position.y, 5, 5);
    }

    endShape();
    pop();
  }
}

class Trail {
  constructor(kayak, rotate, spread) {
    this.kayak = kayak;
    this.particles = [];
    this.maxParticles = 100;

    this.spread = spread;
    this.rotate = rotate;

    this.angle = 0;
  }

  add() {
    const direction = this.kayak.movement.copy().rotate(this.rotate);
    const offset = direction
      .copy()
      .normalize()
      .mult(map(sin(this.angle), 0, 1, this.spread / 1.5, this.spread));

    this.particles.unshift({
      position: this.kayak.position.copy().add(offset),
      movement: direction.mult(this.spread / 20),
    });

    while (this.particles.length > this.maxParticles) {
      this.particles.pop();
    }
  }

  update() {
    if (frameCount % 2 === 0 && this.kayak.movement.mag() > 0.1) {
      this.add();
    }

    this.particles.forEach((particle) => {
      particle.position.add(particle.movement);
      particle.movement.mult(0.98);
    });

    this.angle += TWO_PI / 25;
  }
}
