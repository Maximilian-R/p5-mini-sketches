class FireWork {
  constructor() {
    this.colors = [
      color(settings.color1),
      color(settings.color2),
      color(settings.color3),
    ];
    this.trailColor = color(settings.trailColor);

    this.exploded = false;
    this.particles = [];

    this.explosionParticlesAmount = random(
      settings.minParticles,
      settings.maxParticles
    );

    this.particle = new Particle(
      random(width),
      height,
      this.trailColor,
      1,
      false,
      settings.trailSize
    );
    this.particle.vel = createVector(
      random(-settings.trailVelX, settings.trailVelX),
      -settings.trailVelY
    );
    this.particle.gravity = createVector(0, 0.2);
  }

  explode() {
    for (let i = 0; i < this.explosionParticlesAmount; i++) {
      const color = this.colors[i % this.colors.length];
      const particle = new Particle(
        this.particle.pos.x,
        this.particle.pos.y,
        color,
        settings.particleFriction,
        true,
        settings.particleSize
      );
      this.particles.push(particle);

      particle.vel = p5.Vector.random2D();
      particle.vel.mult(
        random(settings.particleVelMin, settings.particleVelMax)
      );
      //particle.vel = createVector(random(-pVelXmin, pVelXmax), random(-pVelYmin, pVelYmax));
    }
  }

  update() {
    if (!this.exploded) {
      this.particle.update();

      if (this.particle.vel.y >= 0) {
        this.exploded = true;
        this.explode();
      }
      return;
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();

      if (this.particles[i].isDone()) {
        this.particles.splice(i, 1);
      }
    }
  }

  draw() {
    if (!this.exploded) {
      this.particle.draw();
      return;
    }

    this.particles.forEach((particle) => {
      particle.draw();
    });
  }

  isDone() {
    if (this.exploded && this.particles.length == 0) {
      return true;
    } else {
      return false;
    }
  }
}
