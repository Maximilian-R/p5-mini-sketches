const points = [];

function setup() {
  const canvasElement = createCanvas(
    window.innerWidth,
    window.innerHeight
  ).canvas;

  canvasElement.addEventListener("mousedown", onMouseDown);

  points.push(new Point(200, 240));
  points.push(new Point(400, 400));
  points.push(new Point(880, 240));
  points.push(new Point(600, 400));
  points.push(new Point(640, 600));

  noStroke();
  noFill();
}

const onMouseDown = (event) => {
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);

  let hasCollision = points.some((point) => {
    if (point.isColliding(mouseX, mouseY)) {
      point.isDragging = true;
      return true;
    }
  });

  if (!hasCollision) {
    points.push(new Point(mouseX, mouseY));
  }
};

const onMouseMove = (event) => {
  points.forEach((point) => {
    if (point.isDragging) {
      point.position.x = mouseX;
      point.position.y = mouseY;
    }
  });
};

const onMouseUp = () => {
  window.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("mouseup", onMouseUp);

  points.forEach((point) => {
    point.isDragging = false;
  });
};

function draw() {
  background("white");

  push();

  stroke("grey");
  beginShape();
  for (let index = 0; index < points.length; index++) {
    vertex(points[index].position.x, points[index].position.y);
  }
  endShape();

  noFill();
  strokeWeight(4);
  stroke("blue");
  beginShape();

  for (let index = 0; index < points.length - 1; index++) {
    const current = points[index].position;
    const next = points[index + 1].position;
    const center = p5.Vector.add(current, next).div(2);

    if (index == 0) vertex(current.x, current.y);
    else if (index == points.length - 2)
      quadraticVertex(current.x, current.y, next.x, next.y);
    else quadraticVertex(current.x, current.y, center.x, center.y);
  }
  endShape();
  pop();

  points.forEach((point) => point.draw());
}

class Point {
  constructor(x, y, control = false) {
    this.position = createVector(x, y);
    this.control = control;
    this.isDragging = false;
  }

  draw() {
    push();
    fill(this.control ? "red" : "black");
    translate(this.position.x, this.position.y);
    ellipse(0, 0, 15, 15);
    pop();
  }

  isColliding(x, y) {
    return dist(this.position.x, this.position.y, x, y) < 15;
  }
}
