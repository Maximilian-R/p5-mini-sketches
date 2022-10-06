const particles = [];

let gravity;
let wind;

const settings = {
  windX: 0,
  windY: 0,
};

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);

  const canvasElement = document.getElementById("defaultCanvas0");
  canvasElement.style.background =
    "-webkit-radial-gradient(#1b2735 0%,#090a0f 100%)";
  canvasElement.style.background = "-o-radial-gradient(#1b2735,#090a0f 100%)";
  canvasElement.style.background = "-moz-radial-gradient(#1b2735,#090a0f)";
  canvasElement.style.background =
    "radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%";

  for (let i = 0; i <= 200; i++) {
    const particle = new Particle(random(0, width), random(0, height));
    particles.push(particle);
  }

  gravity = createVector(0.0, 0.4);
  wind = createVector(0, 0);

  setupGUI();
}

function draw() {
  clear();

  particles.forEach((particle) => {
    particle.update();
  });
}

function setupGUI() {
  const pane = new Tweakpane.Pane();

  pane
    .addInput(settings, "windX", { label: "wind x", min: -5, max: 5 })
    .on("change", (event) => {
      wind.x = event.value;
    });
  pane
    .addInput(settings, "windY", { label: "wind y", min: -5, max: 5 })
    .on("change", (event) => {
      wind.y = event.value;
    });
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.force = createVector(random(-0.04, 0.04), 0);

    this.size = random(1, 6);
  }

  update() {
    const noise = random(-0.04, 0.04);
    this.force.add(noise);
    this.force.limit(1);

    this.vel = p5.Vector.mult(gravity, this.size);
    this.vel.add(this.force);
    this.vel.add(wind);
    this.pos.add(this.vel);

    this.bounding();
    this.render();
  }

  render() {
    stroke(255);
    strokeWeight(this.size);
    point(this.pos.x, this.pos.y);
  }

  bounding() {
    const margin = this.size;

    if (this.pos.x >= width + margin) {
      this.pos.x = 0 - margin;
    } else if (this.pos.x <= 0 - margin) {
      this.pos.x = width + margin;
    }

    if (this.pos.y >= height + margin) {
      this.pos.y = 0 - margin;
      this.pos.x = random(0, width);
    } else if (this.pos.y <= 0 - margin) {
      this.pos.y = height + margin;
      this.pos.x = random(0, width);
    }
  }
}
