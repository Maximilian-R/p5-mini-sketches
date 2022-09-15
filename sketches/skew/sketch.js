const num = 40;
const degrees = -30;
const rects = [];
const risoColors = [];
const colors = {};
let mask = {};

async function preload() {
  loadJSON("./riso-colors.json", (data) => {
    risoColors.push(...data);
  });
}

async function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);

  //randomSeed(100);

  colors.bgColor = color(
    risoColors[Math.floor(random() * risoColors.length)].hex
  );

  colors.rectColors = [
    pickRandom(risoColors),
    pickRandom(risoColors),
    // pickRandom(risoColors)
  ];

  mask = {
    radius: min(width * 0.4, height * 0.4),
    strokeWeight: 20,
    sides: 3,
    x: width * 0.5,
    y: height * 0.58,
    color: pickRandom(colors.rectColors).hex,
  };

  let x, y, w, h, fillColor, strokeColor, blend;
  for (let index = 0; index < num; index++) {
    x = random(0, width);
    y = random(0, height);
    w = random(200, 600);
    h = random(40, 200);

    fillColor = pickRandom(colors.rectColors).hex;
    strokeColor = pickRandom(colors.rectColors).hex;
    blend = random() > 0.5 ? BLEND : OVERLAY;

    rects.push({ x, y, w, h, fillColor, strokeColor, blend });
  }
}

function draw() {
  noLoop();
  background(colors.bgColor);

  push();

  translate(mask.x, mask.y);
  strokeWeight(0);
  noFill();
  drawPolygon(mask.radius, mask.sides);
  drawingContext.clip();

  rects.forEach((rect) => {
    const { x, y, w, h, fillColor, strokeColor, blend } = rect;
    push();

    translate(-mask.x, -mask.y);
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
    drawSkewedRect(w, h, degrees);

    drawingContext.shadowColor = null;

    strokeWeight(10);
    stroke(strokeColor);
    noFill();
    drawSkewedRect(w, h, degrees);

    blendMode(BLEND);
    stroke("#000");
    strokeWeight(2);
    drawSkewedRect(w, h, degrees);

    pop();
  });

  pop();

  push();
  translate(mask.x, mask.y);
  blendMode(BURN);
  noFill();
  strokeWeight(mask.strokeWeight);
  stroke(mask.color);
  drawPolygon(mask.radius - mask.strokeWeight, mask.sides);
  pop();
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
