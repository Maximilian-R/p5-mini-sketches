class Particle {
  constructor(x, y, color, friction, fadeOut, strokeSize) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.friction = friction;

    this.color = color;
    this.strokeSize = strokeSize;
    this.fadeOut = fadeOut;
    this.lifespan = 1.0;
    this.lifeDrain = random(
      settings.particleDrainMin,
      settings.particleDrainMax
    );

    this.gravity = createVector(0, settings.gravity);
  }

  draw() {
    strokeWeight(this.strokeSize);
    stroke(this.color);
    point(this.pos.x, this.pos.y);
  }

  update() {
    if (this.fadeOut) {
      this.lifespan -= this.lifeDrain;
      this.color.setAlpha(this.lifespan * 255);
    }

    this.vel.mult(this.friction);

    this.acc.add(this.gravity);
    this.vel.add(this.acc);
    this.pos.add(this.vel);

    this.acc.mult(0);
  }

  isDone() {
    if (this.lifespan < 0) {
      return true;
    } else {
      return false;
    }
  }
}
