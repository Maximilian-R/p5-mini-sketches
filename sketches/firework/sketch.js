const fireworks = [];

const settings = {
  color1: "#190dd2",
  color2: "#eb0fb7",
  color3: "#01caf5",
  minParticles: 50,
  maxParticles: 100,

  trailColor: "#ffffff",
  trailSize: 6,
  trailVelX: 5,
  trailVelY: 16,

  particleVelMin: 12,
  particleVelMax: 25,

  particleFriction: 0.9,
  particleSize: 4,
  particleGravityY: 0,

  particleDrainMin: 0.01,
  particleDrainMax: 0.03,

  backgroundAlpha: 50,
  backgroundColor: "#000000",

  spawnRate: 20,
  gravity: 0.2,
};

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  setupGUI();
  noStroke();
}

function draw() {
  const c = color(settings.backgroundColor);
  c.setAlpha(settings.backgroundAlpha);
  background(c);

  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].draw();

    if (fireworks[i].isDone()) {
      fireworks.splice(i, 1);
    }
  }

  if (frameCount % (51 - settings.spawnRate) == 0) {
    fireworks.push(new FireWork());
  }
}

function setupGUI() {
  const pane = new Tweakpane.Pane();

  pane.addInput(settings, "spawnRate", { min: 1, max: 50, step: 1 });
  pane.addInput(settings, "gravity", { min: -0.2, max: 0.4 });

  const f0 = pane.addFolder({ title: "Color" });
  const f1 = pane.addFolder({ title: "Trail" });
  const f2 = pane.addFolder({ title: "Particle" });

  f0.addInput(settings, "color1", { label: "Particle" });
  f0.addInput(settings, "color2", { label: "Particle" });
  f0.addInput(settings, "color3", { label: "Particle" });
  f0.addInput(settings, "trailColor", { label: "Trail" });
  f0.addInput(settings, "backgroundColor", { label: "Background" });
  f0.addInput(settings, "backgroundAlpha", {
    label: "Alpha",
    min: 0,
    max: 255,
    step: 1,
  });

  f1.addInput(settings, "trailSize", {
    label: "size",
    min: 1,
    max: 20,
    step: 1,
  });
  f1.addInput(settings, "trailVelX", {
    label: "vel x",
    min: 0,
    max: 20,
    step: 1,
  });
  f1.addInput(settings, "trailVelY", {
    label: "vel y",
    min: 1,
    max: 40,
    step: 1,
  });

  f2.addInput(settings, "minParticles", {
    label: "min amount",
    min: 1,
    max: 1000,
    step: 1,
  });
  f2.addInput(settings, "maxParticles", {
    label: "max amount",
    min: 1,
    max: 1000,
    step: 1,
  });
  f2.addInput(settings, "particleSize", {
    label: "size",
    min: 1,
    max: 20,
    step: 1,
  });
  f2.addInput(settings, "particleVelMin", {
    label: "min vel",
    min: 0,
    max: 100,
  });
  f2.addInput(settings, "particleVelMax", {
    label: "max vel",
    min: 0,
    max: 100,
  });
  f2.addInput(settings, "particleFriction", {
    label: "friction",
    min: 0.5,
    max: 1,
  });
  f2.addInput(settings, "particleDrainMin", {
    label: "min drain",
    min: 0.005,
    max: 0.05,
  });
  f2.addInput(settings, "particleDrainMax", {
    label: "max drain",
    min: 0.005,
    max: 0.05,
  });
}
