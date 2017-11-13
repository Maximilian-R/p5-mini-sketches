function Particle(x, y, color, friction, fadeOut, strokeSize) {

  this.pos = createVector(x, y);
  this.vel = createVector(0, 0);
  this.acc = createVector(0, 0);
  this.friction = friction;

  this.color = color;
  this.cValue = 255;
  this.strokeSize = strokeSize;
  this.fadeOut = fadeOut;
  this.lifespan = 1.0;
  this.lifeDrain = random(data.particleDrainMin, data.particleDrainMax);

  this.gravity = createVector(0, data.gravity);


  this.update = function() {

    // Friction - Reduce speed -- DO NOT APPLY TO FIREWORK SHOT.
    this.vel.mult(this.friction);

    if (this.fadeOut) {
      // Reduce lifespan
      this.lifespan -= this.lifeDrain;
    }

    // Apply force (gravity)
    this.acc.add(this.gravity);


    // Movement
    this.vel.add(this.acc);
    this.pos.add(this.vel);

    // Reset acc, it get caluclated each frame in applyForce
    this.acc.mult(0);
  }

  this.show = function() {
    strokeWeight(this.strokeSize);
    var c = this.color.levels;
    stroke('rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + this.lifespan +')');
    point(this.pos.x, this.pos.y);
  }

  this.done = function() {
    if (this.lifespan < 0) {
      return true;
    } else {
      return false;
    }
  }

}
