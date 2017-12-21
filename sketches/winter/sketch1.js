//https://gamedevelopment.tutsplus.com/tutorials/adding-turbulence-to-a-particle-system--gamedev-13332
// https://www.youtube.com/watch?v=b8oVAS9IdZM
var emitter;

var gravity;


function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight, WEBGL);

  emitter = new ParticleEmitter();

  gravity = createVector(0, 1.0, 0);
  vortex = new Vortex();
}

function draw() {
  background(33, 46, 66);
  orbitControl();

  pointLight(255, 255, 255, 0, 0, 0);


  fill(100, 100, 240, 10);
  push();
  translate(0, 300, 0);
  box(5000, 40, 5000);
  pop();

  emitter.update();

  rotateX(millis() / 1000);

  vortex.pos.x = mouseX - width * 0.5;
  vortex.pos.y = mouseY - height * 0.5;
}

function mousePressed() {
  emitter.spawnParticle();
}

class ParticleEmitter {
  constructor() {
    this.pos = createVector(0, -600, -600);
    this.particles = [];

    this.spawnbox = createVector(1000, 40, 500);

    this.counter = 0;
    this.spawnRate = 2;
  }

  spawnParticle() {
    var pos = createVector(
      random(this.pos.x - this.spawnbox.x * 0.5, this.pos.x + this.spawnbox.x * 0.5),
      random(this.pos.y - this.spawnbox.y * 0.5, this.pos.y + this.spawnbox.y * 0.5),
      random(this.pos.z - this.spawnbox.z * 0.5, this.pos.z + this.spawnbox.z * 0.5));
    this.particles.push(new Particle(pos));
  }

  update() {
    this.counter++;
    if(this.counter % this.spawnRate == 0) {
      this.spawnParticle();
    }

    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    fill(100, 100, 240, 10);
    stroke(255);
    box(this.spawnbox.x, this.spawnbox.y, this.spawnbox.z);
    pop();

    fill(255, 255);
    for (var i = 0; i < this.particles.length; i++) {
      this.particles[i].update();
      if(this.particles[i].dead) {
        this.particles.splice(i, 1);
      }
    }
  }
}



class Particle {
  constructor(pos) {
    this.pos = pos;
    this.vel;
    this.randomForce = createVector(0, 0, 0);

    this.alpha = 255;

    this.dead = false;

    this.size = random(1, 5);
    this.mass = random()
  }

  update() {
    this.randomForce.add(random(-0.04, 0.04), 0, random(-0.04, 0.04));

    this.vel = createVector(0, 0, 0);
    var downForce = p5.Vector.mult(gravity, this.size);
    this.vel.add(downForce);
    this.vel.add(this.randomForce);

    var dx = this.pos.x - vortex.pos.x;
    var dz = this.pos.z - vortex.pos.z;
    var vx = -dz*vortex.speed;
    var vz =  dx*vortex.speed;
    var factor = 1 / (1 + (dx * dx + dz * dz) / vortex.scale);

    this.vel.x += (vx - this.vel.x) * factor;
    this.vel.z += (vz - this.vel.z) * factor;

    if (this.pos.y < 300) {
      this.pos.add(this.vel);
    } else {
      this.alpha -= 3;
    }

    if(this.alpha <= 0) {
      this.dead = true;
    }

    fill(255, this.alpha);
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    sphere(this.size);
    pop();
  }
}

var vortex;

class Vortex {
  constructor() {
    this.pos = createVector(0, -800, -600);
    this.speed = 2000;
    this.scale = 1;
  }
}
