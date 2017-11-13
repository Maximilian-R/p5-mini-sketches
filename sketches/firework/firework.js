function FireWork() {

  this.colors = [color(data.color1), color(data.color2), color(data.color3)];
  this.trailColor = color(data.trailColor);

  this.exploded = false;
  this.particles = [];

  this.explosionParticles = random(data.minParticles, data.maxParticles);

  this.fireWork = new Particle(random(width), height, this.trailColor, 1, false, data.trailSize);
  this.fireWork.vel = createVector(random(-data.trailVelX, data.trailVelX), -data.trailVelY);
  this.fireWork.gravity = createVector(0, 0.2);

  this.done = function() {
    if (this.exploded && this.particles.length == 0) {
      return true;
    } else {
      return false;
    }
  }

  this.explode = function() {

    for (var i = 0; i < this.explosionParticles; i++) {

      // Create new particle and add to particles.
      var color = this.colors[i % this.colors.length];
      var p = new Particle(this.fireWork.pos.x, this.fireWork.pos.y, color, data.particleFriction, true, data.particleSize);
      this.particles.push(p);

      p.vel = p5.Vector.random2D();
      p.vel.mult(random(data.particleVelMin, data.particleVelMax));


      //p.vel = createVector(random(-pVelXmin, pVelXmax), random(-pVelYmin, pVelYmax));
      }
  }

  this.update = function() {
    if (!this.exploded) {
      this.fireWork.update();

      if (this.fireWork.vel.y >= 0) {
        this.exploded = true;
        this.explode();
      }
      return;
    }

    for (var i = this.particles.length -1; i >= 0; i--) {
      this.particles[i].update();

      if(this.particles[i].done()) {
        this.particles.splice(i, 1);
      }

    }
  }

  this.show = function() {
    if (!this.exploded) {
      this.fireWork.show();
      return;
    }

    for (var i = 0; i < this.particles.length; i++) {
      this.particles[i].show();
    }
  }

}
