let glassesImage;
let tennisballImage;
let ball;
const glasses = [];

function preload() {
  glassesImage = loadImage("eyeglasses.png");
  tennisballImage = loadImage("tennisball.png");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);

  noCursor();
  createGlasses();

  ball = new TennisBall(createVector(width / 2, height / 2), tennisballImage);
}

function createGlasses() {
  const size = 200;
  const margin = size / 2;
  let loop = 0;

  for (let h = size / 4; h < height; h += size / 2) {
    for (
      let w = size / 2 + margin - size;
      w < width + size;
      w += size + margin
    ) {
      const offset = loop % 2 == 0 ? 0 : margin * 1.5;
      glasses.push(new Glasses(w + offset, h));
    }
    loop++;
  }
}

function draw() {
  background(203, 242, 220);

  glasses.forEach((glass) => {
    glass.draw();
  });

  ball.draw();
}

class TennisBall {
  constructor(position, img) {
    this.position = position;
    this.radius = 60;
    this.img = img;
  }

  draw() {
    this.position = createVector(mouseX, mouseY);
    image(this.img, this.position.x, this.position.y, this.radius, this.radius);
  }
}

class Glasses {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.size = 200;
    this.eyeColor = color(random(50, 255), random(50, 255), random(50, 255));
    this.eye1 = new Eye(x - this.size / 4, y, this.eyeColor);
    this.eye2 = new Eye(x + this.size / 4, y, this.eyeColor);
  }

  draw() {
    push();
    translate(this.position.x, this.position.y);
    image(glassesImage, 0, 0, this.size, this.size);
    pop();

    this.eye1.draw();
    this.eye2.draw();
  }
}

class Eye {
  constructor(x, y, c) {
    this.position = createVector(x, y);
    this.size = 40;
    this.coloreyeSize = this.size / 2;
    this.pupilSize = this.coloreyeSize * 0.6;
    this.angle = 0;
    this.color = c;
  }

  draw() {
    const p1 = this.position;
    this.angle = atan2(ball.position.y - p1.y, ball.position.x - p1.x);

    push();
    noStroke();

    fill(255);
    translate(p1.x, p1.y);
    ellipse(0, 0, this.size);

    const r = this.size / 2 - this.coloreyeSize / 2;
    const d = dist(p1.x, p1.y, ball.position.x, ball.position.y);
    const x = constrain(d * 0.05, 0, r);

    fill(this.color);
    rotate(this.angle);
    ellipse(x, 0, this.coloreyeSize);
    fill(0);
    ellipse(x, 0, this.pupilSize);

    pop();
  }
}
