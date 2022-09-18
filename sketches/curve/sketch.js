const points = [];
const settings = {
  columns: 50,
  rows: 8,
  frequency: 0.002,
  amplitude: 90,
  color1: "#ff00d1",
  color2: "#fff000",
  midPointX: 0.5,
  midPointY: 0.5,
  animationSpeedX: 1,
  animationSpeedY: 0,
  lineWidthMin: 0,
  lineWidthMax: 5,
};
let gridWidth;
let gridHeight;
let cellWidth;
let cellHeight;
let position;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  generateSketch();

  const gui = new dat.GUI({ hideable: true });
  const folder1 = gui.addFolder("Grid");
  folder1
    .add(settings, "columns", 2, 100, 1)
    .name("Columns")
    .onChange(generateSketch);
  folder1
    .add(settings, "rows", 1, 100, 1)
    .name("Rows")
    .onChange(generateSketch);

  const folder2 = gui.addFolder("Rendering");
  folder2.addColor(settings, "color1").name("Color 1").onChange(generateSketch);
  folder2.addColor(settings, "color2").name("Color 2").onChange(generateSketch);
  folder2
    .add(settings, "lineWidthMin", 0, 10, 1)
    .name("Line Width Min")
    .onChange(generateSketch);
  folder2
    .add(settings, "lineWidthMax", 0, 10, 1)
    .name("Line Width Max")
    .onChange(generateSketch);

  const folder3 = gui.addFolder("Curve");
  folder3
    .add(settings, "frequency", 0, 0.01, 0.0001)
    .name("Noise Frequency")
    .onChange(generateSketch);
  folder3
    .add(settings, "amplitude", 1, 200, 1)
    .name("Noise Amplitude")
    .onChange(generateSketch);
  folder3.add(settings, "midPointX", -10, 10, 0.1).name("Control Point X");
  folder3.add(settings, "midPointY", -10, 10, 0.1).name("Control Point Y");

  const folder4 = gui.addFolder("Animation");
  folder4.add(settings, "animationSpeedX", -10, 10, 1).name("Speed X");
  folder4.add(settings, "animationSpeedY", -10, 10, 1).name("Speed Y");

  folder1.open();
  folder2.open();
  folder3.open();
  folder4.open();
}

function generateSketch() {
  gridWidth = width * 0.8;
  gridHeight = height * 0.8;

  cellWidth = gridWidth / settings.columns;
  cellHeight = gridHeight / settings.rows;

  position = createVector(
    (width - gridWidth) * 0.5,
    (height - gridHeight) * 0.5
  );

  if (points.length > 0) {
    points.splice(0, points.length);
  }

  let x, y, n, lineWidth, strokeColor;

  for (let index = 0; index < settings.columns * settings.rows; index++) {
    x = (index % settings.columns) * cellWidth;
    y = floor(index / settings.columns) * cellHeight;
    n =
      (noise(x * settings.frequency, y * settings.frequency) * 2 - 1) *
      settings.amplitude;
    // x += n;
    // y += n;

    lineWidth = map(
      n,
      -settings.amplitude,
      settings.amplitude,
      settings.lineWidthMin,
      settings.lineWidthMax
    );
    strokeColor = lerpColor(
      color(settings.color1),
      color(settings.color2),
      map(n, -settings.amplitude, settings.amplitude, 0, 1)
    );
    points.push(new Point(x, y, lineWidth, strokeColor));
  }
}

function draw() {
  background("black");

  push();
  noFill();
  translate(position.x, position.y);
  translate(cellWidth / 2, cellHeight / 2);

  let n;

  points.forEach((point) => {
    n =
      (noise(
        (point.initialX + frameCount * settings.animationSpeedX) *
          settings.frequency,
        (point.initialY + frameCount * settings.animationSpeedY) *
          settings.frequency
      ) *
        2 -
        1) *
      settings.amplitude;
    point.x = point.initialX + n;
    point.y = point.initialY + n;
  });

  let last;

  for (let row = 0; row < settings.rows; row++) {
    for (let column = 0; column < settings.columns - 1; column++) {
      const index = row * settings.columns + column;
      const current = points[index + 0];
      const next = points[index + 1];
      const center = createVector(
        current.x + (next.x - current.x) * settings.midPointX,
        current.y + (next.y - current.y) * settings.midPointY
      );

      if (!column) last = current;

      beginShape();
      strokeWeight(current.lineWidth);
      stroke(current.strokeColor);
      vertex(last?.x, last?.y);
      quadraticVertex(current.x, current.y, center.x, center.y);
      // if (column == 0) vertex(current.x, current.y);
      // else if (column == settings.columns - 2)
      //   quadraticVertex(current.x, current.y, next.x, next.y);
      // else quadraticVertex(current.x, current.y, center.x, center.y);
      endShape();

      last = center.sub(
        createVector(
          (column / settings.columns) * 250,
          (row / settings.rows) * 250
        )
      );
    }
  }
  points.forEach((point) => point.draw());
  pop();
}

class Point {
  constructor(x, y, lineWidth, strokeColor) {
    this.x = x;
    this.y = y;
    this.initialX = x;
    this.initialY = y;
    this.lineWidth = lineWidth;
    this.strokeColor = strokeColor;
  }

  get vector() {
    return createVector(this.x, this.y);
  }

  draw() {
    push();
    fill("red");
    translate(this.x, this.y);
    // ellipse(0, 0, 15, 15);
    pop();
  }
}
