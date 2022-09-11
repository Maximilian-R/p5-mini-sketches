var particleSystem;

var gravity;
var wind;

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight, WEBGL);
  //canvas = createCanvas(window.innerWidth, window.innerHeight);

  // 3D
  particleSystem = new ParticleSystem(createVector(0, -300, 0));

  //particleSystem = new ParticleSystem(createVector(width * 0.5, 0, 0));

  gravity = createVector(0, 0.2, 0);
  wind = createVector(0, 0, 0);
  air = createVector(0, 0, 0);
}


function draw() {

if(mouseIsPressed) {
  if(mouseX > width * 0.5) {
    wind.x += 0.1;
  } else {
    wind.x -= 0.1;
  }
}



  background(32, 56, 89)
  particleSystem.update();
}

class Vortex {
  constructor(pos) {
    this.pos = pos;
    this.speed = 0;
    this.scale = 1;
    this.alhpa = 255;
  }
}

class ParticleSystem {
  constructor(pos) {
    this.pos = pos;
    this.particles = [];
    this.vortex = new Vortex(createVector(0, 0, 0));
  }

  applyWind(wind) {
    for (var i = 0; i < this.particles.length; i++) {
      this.particles[i].applyForce(wind);
    }
  }

  applyAirResistance() {
    var c = 0.1;

    for (var i = 0; i < this.particles.length; i++) {
      var speed = this.particles[i].vel.mag();
      var dragMagnitude = c * speed * speed;
      var drag = this.particles[i].vel.copy();
      drag.mult(-1);
      drag.normalize();
      drag.mult(dragMagnitude);
      this.particles[i].applyForce(drag);
    }
  }

  applyGravity(gravity) {
    for (var i = 0; i < this.particles.length; i++) {
      var g = gravity.copy()
      g.mult(this.particles[i].mass)
      this.particles[i].applyForce(g);
    }
  }

  applyRandom() {
    for (var i = 0; i < this.particles.length; i++) {
      var force = createVector(random(-0.4, 0.4), 0, 0);
      this.particles[i].applyForce(force);
    }
  }

  applyVortex() {
    for (var i = 0; i < this.particles.length; i++) {
      var pa = this.particles[i];

      var dx = pa.pos.x - this.vortex.pos.x;
      var dz = pa.pos.z - this.vortex.pos.z;
      var vx = -dz*this.vortex.speed; //+ vortex.vel.x;
      var vz =  dx*this.vortex.speed; //+ vortex.vel.z;


      var factor = 1 / (1 + (dx * dx + dz * dz) / this.vortex.scale);

      var force = createVector((vx - pa.vel.x) * factor, (vz- pa.vel.z) * factor, 0);
      this.particles[i].applyForce(force);
    }
  }

  update() {

    if(frameCount % 2 == 0) {
      var pos = this.pos.copy();
      pos.x += random(-200, 200);
      pos.z += random(-200, 200);
      this.particles.push(new Particle(pos));
    }

    this.applyAirResistance();
    this.applyWind(wind)
    this.applyGravity(gravity);
    this.applyRandom();
    this.applyVortex();

    for (var i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();
      this.particles[i].draw();
      if(this.particles[i].isDead()) {
        this.particles.splice(i, 1);
      }
    }
  }
}

class Particle {
  constructor(pos) {
    this.pos = pos;
    this.vel = createVector(0, 0, 0);
    this.acc = createVector(0, 0, 0);
    this.timeToLive = 400;
    this.size = random(2, 5);
    this.mass = this.size;
  }

  applyForce(force) {
    var f = force.copy();
    f.div(this.mass);
    this.acc.add(f);
  }

  isDead() {
    if (this.timeToLive <= 0) {
      return true;
    } else {
      return false;
    }
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);

    this.timeToLive -= 1;
    this.acc.mult(0);
  }

  //3D
  draw() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    fill(255, this.timeToLive);
    sphere(this.size);
    pop();
  }

  // draw() {
  //   push();
  //   translate(this.pos.x, this.pos.y, this.pos.z);
  //   strokeWeight(0);
  //   fill(255, 255, 255, this.timeToLive);
  //   ellipse(0, 0, this.size * 2);
  //   pop();
  // }
}
