const rects = [];
const risoColors = [];
const colors = {};

async function preload() {
  loadJSON("./riso-colors.json", (data) => {
    risoColors.push(...data);
  });
}

const settings = {
  rects: 40,
  degrees: 150,
  pickColors: 2,
  seed: window.crypto?.randomUUID() ?? "",
  mask: {},
  animate: false,
};

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  settings.mask = {
    radius: min(width * 0.4, height * 0.4),
    strokeWeight: 20,
    sides: 3,
    degrees: 0,
    x: width * 0.5,
    y: height * 0.58,
    color: "",
  };

  const gui = new Tweakpane.Pane();

  const folder1 = gui
    .addFolder({
      title: "Rectangles",
    })
    .on("change", () => generateSketch());
  folder1.addInput(settings, "rects", {
    min: 1,
    max: 100,
    step: 1,
    label: "Rectangles",
  });
  folder1.addInput(settings, "degrees", {
    min: 0,
    max: 180,
    step: 5,
    label: "Degrees",
  });
  folder1.addInput(settings, "pickColors", {
    min: 1,
    max: 10,
    step: 1,
    label: "Pick colors",
  });
  folder1.addInput(settings, "animate", {
    label: "Animate",
  });
  const folder2 = gui
    .addFolder({
      title: "Mask",
    })
    .on("change", () => generateSketch());
  folder2.addInput(settings.mask, "radius", {
    label: "Radius",
    step: 1,
    min: 100,
    max: 1000,
  });
  folder2.addInput(settings.mask, "sides", {
    label: "Sides",
    step: 1,
    min: 3,
    max: 50,
  });
  folder2.addInput(settings.mask, "degrees", {
    label: "Degrees",
    min: 0,
    max: 360,
  });
  folder2.addInput(settings.mask, "strokeWeight", {
    label: "StrokeWeight",
    step: 1,
    min: 0,
    max: 50,
  });

  const folder3 = gui.addFolder({
    title: "Seed",
  });
  folder3.addInput(settings, "seed", {
    label: "Seed",
  });
  folder3
    .addButton({
      title: "Generate Seed",
    })
    .on("click", () => {
      settings.seed = window.crypto?.randomUUID() ?? "";
      generateSketch();
      gui.refresh();
    });

  generateSketch();
}

function generateSketch() {
  const seed = Array.from(settings.seed).reduce(
    (a, c) => a + c.charCodeAt(0),
    0
  );

  randomSeed(seed || undefined);
  colors.bgColor = pickRandom(risoColors).hex;
  colors.rectColors = pickRandoms(risoColors, settings.pickColors);

  settings.mask.color = pickRandom(colors.rectColors).hex;

  if (rects.length > 0) {
    rects.splice(0, rects.length);
  }

  let x, y, w, h, speed, fillColor, strokeColor, blend;
  for (let index = 0; index < settings.rects; index++) {
    x = random(0, width);
    y = random(0, height);
    w = random(200, 600);
    h = random(40, 200);
    fillColor = pickRandom(colors.rectColors).hex;
    strokeColor = pickRandom(colors.rectColors).hex;
    blend = random() > 0.5 ? BLEND : OVERLAY;
    speed = random(0.5, 1);

    rects.push({ x, y, w, h, speed, fillColor, strokeColor, blend });
  }

  loop();
}

function draw() {
  if (!settings.animate) {
    noLoop();
  }

  background(colors.bgColor);

  push();

  translate(settings.mask.x, settings.mask.y);
  strokeWeight(0);
  noFill();
  push();
  const maskAngle = radians(settings.mask.degrees);
  rotate(maskAngle);
  drawPolygon(settings.mask.radius, settings.mask.sides);
  pop();
  drawingContext.clip();

  rects.forEach((rect) => {
    moveRect(rect);
    const { x, y, w, h, fillColor, strokeColor, blend } = rect;
    push();

    translate(-settings.mask.x, -settings.mask.y);
    translate(x, y);
    blendMode(blend);

    drawingContext.shadowColor = offsetHSL(
      fillColor,
      0,
      0,
      -40,
      0.5
    ).toString();
    drawingContext.shadowOffsetX = -10;
    drawingContext.shadowOffsetY = 20;

    fill(fillColor);
    noStroke();
    drawSkewedRect(w, h, settings.degrees);

    drawingContext.shadowColor = null;

    strokeWeight(10);
    stroke(strokeColor);
    noFill();
    drawSkewedRect(w, h, settings.degrees);

    blendMode(BLEND);
    stroke("#000");
    strokeWeight(2);
    drawSkewedRect(w, h, settings.degrees);

    pop();
  });

  pop();

  push();
  translate(settings.mask.x, settings.mask.y);
  blendMode(BURN);
  noFill();
  strokeWeight(settings.mask.strokeWeight);
  stroke(settings.mask.color);
  rotate(maskAngle);
  drawPolygon(
    settings.mask.radius - settings.mask.strokeWeight,
    settings.mask.sides
  );
  pop();
}

function moveRect(rect) {
  const { x, y, w, h, speed } = rect;
  const angle = radians(settings.degrees);
  const nextPosition = createVector(speed).setHeading(angle);
  rect.x += nextPosition.x;
  rect.y += nextPosition.y;
  if (x + w / 2 < 0) {
    rect.x = width + w / 2;
  } else if (x - w / 2 > width) {
    rect.x = -w / 2;
  }
  if (y + h / 2 < 0) {
    rect.y = height + h / 2;
  } else if (y - h / 2 > height) {
    rect.y = -h / 2;
  }
}

function drawSkewedRect(w = 300, h = 100, degrees = -45) {
  const radius = w;
  const angle = radians(degrees);
  const rx = Math.cos(angle) * radius;
  const ry = Math.sin(angle) * radius;

  push();
  translate(rx * -0.5, (ry + h) * -0.5);

  beginShape();
  vertex(0, 0);
  vertex(rx, ry);
  vertex(rx, ry + h);
  vertex(0, h);
  endShape(CLOSE);

  pop();
}

function drawPolygon(radius = 200, sides = 3) {
  const slice = TWO_PI / sides;
  beginShape();

  for (let i = 0; i < sides; i++) {
    const theta = i * slice - HALF_PI;
    vertex(cos(theta) * radius, sin(theta) * radius);
  }
  endShape(CLOSE);
}

function offsetHSL(hex, h, s, l, a = 1) {
  colorMode(HSL);
  const hsl = color(hue(hex) + h, saturation(hex) + s, lightness(hex) + l, a);
  const rgb = color(red(hsl), green(hsl), blue(hsl), alpha(hsl));
  return rgb;
}

function pickRandom(array) {
  return array[Math.floor(random() * array.length)];
}

function pickRandoms(array, pick) {
  const selected = [];
  for (let index = 0; index < pick; index++) {
    selected.push(pickRandom(array));
  }
  return selected;
}
