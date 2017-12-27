var emitter;
var gravity;
var wind;

// let spriteSheet;
// let textures = [];

function preload() {
  //spriteSheet = loadImage("flakes32.png");
}

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight, WEBGL);

  // Give the canvas a gradient background. Drawing a gradient background each frame takes to much performance.
  var can = document.getElementById("defaultCanvas0");
  can.style.background = "-webkit-radial-gradient(#1b2735 0%,#090a0f 100%)";
  can.style.background = "-o-radial-gradient(#1b2735,#090a0f 100%)";
  can.style.background = "-moz-radial-gradient(#1b2735,#090a0f)";
  can.style.background = "radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%";


  emitter = new ParticleEmitter();

  gravity = createVector(0, 0.8, 0);
  wind = createVector(0.5, 0, 0);
  vortex = new Vortex();

  // for (var x = 0; x < spriteSheet.width; x+= 32) {
  //   for (var y = 0; y < spriteSheet.height; y+= 32) {
  //     let img = spriteSheet.get(x, y, 32, 32);
  //     textures.push(img);
  //   }
  // }
}

function draw() {

  wind.x += random(-0.02, 0.02);
  wind.z += random(-0.02, 0.02);
  wind.limit(0.2);


  //background(33, 46, 66);

  camera(0, 0, -300);

  fill(50, 100);
  push();
  translate(0, 300, 0);
  box(5000, 40, 5000);
  pop();

  emitter.update();
  vortex.update();
}

var vortexOn = true;
function mousePressed() {
  vortexOn = !vortexOn;
}

class ParticleEmitter {
  constructor() {
    this.pos = createVector(0, -600, -600);
    this.particles = [];

    this.spawnbox = createVector(1000, 40, 500);
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
    if(frameCount % this.spawnRate == 0) {
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
    this.acc = createVector(0, 0, 0);
    this.vel = createVector(0, 0, 0);
    this.randomForce = createVector(0, 0, 0);
    this.alpha = 255;
    this.dead = false;
    this.size = random(1, 4);
  }

  update() {

    this.randomForce.add(random(-0.06, 0.06), 0, random(-0.06, 0.06));

    /* Apply forces */

    this.acc.add(gravity);
    this.acc.add(wind);
    this.acc.add(this.randomForce);

    if (vortex.power != 0) {
      var dx = this.pos.x - vortex.pos.x;
      var dz = this.pos.z - vortex.pos.z;
      var vx = -dz*vortex.getPower();
      var vz =  dx*vortex.getPower();
      var factor = 1 / (1 + (dx * dx + dz * dz) / vortex.scale);

      this.acc.x += (vx - this.vel.x) * factor;
      this.acc.z += (vz - this.vel.z) * factor;
    }

    this.vel.add(this.acc);
    this.acc.mult(0);

    /* Air resistance */

    var c = 0.04;
    var speed = this.vel.mag();
    var dragMagnitude = c * speed * speed;
    var drag = this.vel.copy();
    drag.mult(-1);
    drag.normalize();
    drag.mult(dragMagnitude);
    this.vel.add(drag);

    /* Fall until hit ground, then fade out */

    if (this.pos.y < 300) {
      this.pos.add(this.vel);
    } else {
      this.alpha -= 3;
      if(this.alpha <= 0) {
        this.dead = true;
      }
    }

    /* Draw */

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
    this.speed = 700;
    this.scale = 1;

    this.power = 1.0;
  }

  getPower() {
    return this.speed * this.power;
  }

  update() {
    if(!vortexOn) {
      this.power -= 0.01;
      if (this.power < 0) {
        this.power = 0.0;
      }
    } else {
      this.power += 0.01;
      if (this.power > 1) {
        this.power = 1;
      }
    }

  }
}
