const particles = [];
let pane;
let img;
let gravity;
let wind;

const settings = {
  wind: { x: 0, y: 0 },
  animateWind: false,
  gravity: { x: 0, y: 0.1 },
  mouseRange: 100,
  mouseForce: 10,
};

function preload() {
  img = loadImage("./particle.png");
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  imageMode(CENTER);

  const canvasElement = document.getElementById("defaultCanvas0");
  canvasElement.style.background =
    "-webkit-radial-gradient(#1b2735 0%,#090a0f 100%)";
  canvasElement.style.background = "-o-radial-gradient(#1b2735,#090a0f 100%)";
  canvasElement.style.background = "-moz-radial-gradient(#1b2735,#090a0f)";
  canvasElement.style.background =
    "radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%";

  for (let i = 0; i <= 500; i++) {
    const particle = new Particle(random(0, width), random(0, height));
    particles.push(particle);
  }

  gravity = createVector(settings.gravity.x, settings.gravity.y);
  wind = createVector(settings.wind.x, settings.wind.y);

  setupGUI();
}

function draw() {
  clear();

  if (settings.animateWind) {
    const value = frameCount / 500;
    settings.wind.x = map(noise(value), 0, 1, -5, 5);
    settings.wind.y = map(noise(2000000 + value), 0, 1, -1, 1);
    pane.refresh();
  }

  const mouse = createVector(mouseX, mouseY);

  const cursor = map(settings.mouseRange, 0, 200, 10, 50);
  tint(255, 208, 97);
  image(img, mouse.x, mouse.y, cursor, cursor);
  noTint();

  particles.forEach((particle) => {
    particle.applyForce(p5.Vector.mult(gravity, particle.mass));
    particle.applyForce(wind);

    const distance = particle.pos.dist(mouse);
    if (distance < settings.mouseRange) {
      const avoid = p5.Vector.sub(mouse, particle.pos).setMag(
        map(distance, 0, settings.mouseRange, -settings.mouseForce, 0)
      );
      particle.applyForce(avoid);
    }

    particle.update();
  });
}

function setupGUI() {
  pane = new Tweakpane.Pane();

  pane
    .addInput(settings, "wind", {
      x: { min: -5, max: 5 },
      y: { min: -5, max: 5 },
    })
    .on("change", (event) => {
      wind.x = event.value.x;
      wind.y = event.value.y;
    });
  pane.addInput(settings, "animateWind", { label: "animate wind" });

  pane
    .addInput(settings, "gravity", {
      x: { min: -5, max: 5 },
      y: { min: -5, max: 5 },
    })
    .on("change", (event) => {
      gravity.x = event.value.x;
      gravity.y = event.value.y;
    });

  const mouseFolder = pane.addFolder({ title: "Mouse" });
  mouseFolder.addInput(settings, "mouseRange", {
    label: "range",
    min: 0,
    max: 200,
    step: 1,
  });
  // mouseFolder.addInput(settings, "mouseForce", {
  //   label: "force",
  //   min: 0,
  //   max: 50,
  //   step: 1,
  // });
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.noise = createVector(0, 0);

    this.mass = random(1, 6);
    this.radius = sqrt(this.mass) * 2;
  }

  applyForce(force) {
    const f = p5.Vector.div(force, this.mass);
    this.acc.add(f);
  }

  drag() {
    const drag = this.vel.copy();
    drag.normalize();
    drag.mult(-1);

    const c = 0.1;
    let speedSq = this.vel.magSq();
    drag.setMag(c * speedSq);

    this.applyForce(drag);
  }

  disturbance() {
    this.noise.add(random(-0.05, 0.05));
    this.noise.limit(0.1);
    this.applyForce(this.noise);
  }

  update() {
    this.disturbance();
    this.drag();

    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);

    this.bounding();
    this.draw();
  }

  draw() {
    image(img, this.pos.x, this.pos.y, this.radius * 2, this.radius * 2);
  }

  bounding() {
    const margin = this.radius;

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
