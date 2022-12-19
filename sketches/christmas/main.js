// @ts-nocheck
function random(min, max) {
  return Math.random() * (max - min) + min;
}
let perlin;
function noise(x, y = 0, z = 0) {
  const PERLIN_YWRAPB = 4;
  const PERLIN_YWRAP = 1 << PERLIN_YWRAPB;
  const PERLIN_ZWRAPB = 8;
  const PERLIN_ZWRAP = 1 << PERLIN_ZWRAPB;
  const PERLIN_SIZE = 4095;
  let perlin_octaves = 4; // default to medium smooth
  let perlin_amp_falloff = 0.5; // 50% reduction/octave
  const scaled_cosine = (i) => 0.5 * (1.0 - Math.cos(i * Math.PI));

  if (perlin == null) {
    perlin = new Array(PERLIN_SIZE + 1);
    for (let i = 0; i < PERLIN_SIZE + 1; i++) {
      perlin[i] = Math.random();
    }
  }

  if (x < 0) {
    x = -x;
  }
  if (y < 0) {
    y = -y;
  }
  if (z < 0) {
    z = -z;
  }

  let xi = Math.floor(x),
    yi = Math.floor(y),
    zi = Math.floor(z);
  let xf = x - xi;
  let yf = y - yi;
  let zf = z - zi;
  let rxf, ryf;

  let r = 0;
  let ampl = 0.5;

  let n1, n2, n3;

  for (let o = 0; o < perlin_octaves; o++) {
    let of = xi + (yi << PERLIN_YWRAPB) + (zi << PERLIN_ZWRAPB);

    rxf = scaled_cosine(xf);
    ryf = scaled_cosine(yf);

    n1 = perlin[of & PERLIN_SIZE];
    n1 += rxf * (perlin[(of + 1) & PERLIN_SIZE] - n1);
    n2 = perlin[(of + PERLIN_YWRAP) & PERLIN_SIZE];
    n2 += rxf * (perlin[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n2);
    n1 += ryf * (n2 - n1);

    of += PERLIN_ZWRAP;
    n2 = perlin[of & PERLIN_SIZE];
    n2 += rxf * (perlin[(of + 1) & PERLIN_SIZE] - n2);
    n3 = perlin[(of + PERLIN_YWRAP) & PERLIN_SIZE];
    n3 += rxf * (perlin[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n3);
    n2 += ryf * (n3 - n2);

    n1 += scaled_cosine(zf) * (n2 - n1);

    r += n1 * ampl;
    ampl *= perlin_amp_falloff;
    xi <<= 1;
    xf *= 2;
    yi <<= 1;
    yf *= 2;
    zi <<= 1;
    zf *= 2;

    if (xf >= 1.0) {
      xi++;
      xf--;
    }
    if (yf >= 1.0) {
      yi++;
      yf--;
    }
    if (zf >= 1.0) {
      zi++;
      zf--;
    }
  }
  return r;
}
function constrain(n, low, high) {
  return Math.max(Math.min(n, high), low);
}
function map(n, start1, stop1, start2, stop2, withinBounds) {
  const newval = ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
  if (!withinBounds) {
    return newval;
  }
  if (start2 < stop2) {
    return constrain(newval, start2, stop2);
  } else {
    return constrain(newval, stop2, start2);
  }
}
function lerpColor(a, b, amount) {
  let ah = parseInt(a.replace(/#/g, ""), 16),
    ar = ah >> 16,
    ag = (ah >> 8) & 0xff,
    ab = ah & 0xff,
    bh = parseInt(b.replace(/#/g, ""), 16),
    br = bh >> 16,
    bg = (bh >> 8) & 0xff,
    bb = bh & 0xff,
    rr = ar + amount * (br - ar),
    rg = ag + amount * (bg - ag),
    rb = ab + amount * (bb - ab);

  return (
    "#" + (((1 << 24) + (rr << 16) + (rg << 8) + rb) | 0).toString(16).slice(1)
  );
}

let canvas, images, ctx;
let mouseX, mouseY, width, height, offsetX, offsetY;

document.addEventListener("mousemove", (event) => {
  updateMouse(event);
});
document.addEventListener("scroll", (event) => {
  updateMouse(event);
});
document.addEventListener("touchmove", (event) => {
  const touch = event.changedTouches[0];
  updateMouse(touch);
});
document.addEventListener("touchstart", (event) => {
  const touch = event.changedTouches[0];
  updateMouse(touch);
});
window.addEventListener("resize", () => {
  updateCanvasSize();
});

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(vector) {
    this.x += vector.x;
    this.y += vector.y;
    return this;
  }

  sub(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
  }

  div(factor) {
    this.x /= factor;
    this.y /= factor;
    if (isNaN(this.x)) {
      this.x = 0;
    }
    if (isNaN(this.y)) {
      this.y = 0;
    }
    return this;
  }

  mult(factor) {
    this.x *= factor;
    this.y *= factor;
    return this;
  }

  normalize() {
    this.div(this.magSq());
    return this;
  }

  limit(max) {
    this.x = Math.min(Math.max(this.x, -max), max);
    this.y = Math.min(Math.max(this.y, -max), max);
    return this;
  }

  setMag(len) {
    this.normalize().mult(len);
    return this;
  }

  magSq() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
    return this;
  }

  dist(target) {
    return Math.sqrt(
      Math.pow(this.x - target.x, 2) + Math.pow(this.y - target.y, 2)
    );
  }

  copy() {
    return new Vector(this.x, this.y);
  }
}
class Cursor {
  constructor() {
    this.pos = new Vector(0, 0);
    this.isMoving = false;
    this.minDistance = 50;
    this.attractForce = 10;
  }

  get radius() {
    return 22 * sizeScale; // 44 = image width
  }

  update() {
    this.pos = new Vector(
      mouseX > -this.radius && mouseX < width + this.radius ? mouseX : -1000,
      mouseY > -this.radius && mouseY < height + this.radius ? mouseY : -1000
    );

    snowEmitter.children.forEach((particle) => {
      const distance = particle.pos.dist(this.pos);
      if (distance < this.minDistance * sizeScale) {
        const avoid = this.pos
          .copy()
          .sub(particle.pos)
          .setMag(
            map(
              distance,
              0,
              this.minDistance * sizeScale,
              (this.isMoving ? -this.attractForce * 2 : this.attractForce) *
                sizeScale,
              0
            )
          );
        particle.applyForce(avoid);
      }
    });
  }

  draw(ctx) {
    const d = this.radius * 2;
    ctx.drawImage(
      images[0],
      this.pos.x - this.radius,
      this.pos.y - this.radius,
      d,
      d
    );
  }
}
class SnowEmitter {
  constructor() {
    this.maxParticles = 1000;
    this.children = [];
    this.gravity = new Vector(0, 0.01);
    this.wind = new Vector(0, 0);
  }

  setup() {
    this.maxParticles = 1000;
    for (let i = 0; i < this.maxParticles; i++) {
      const particle = new SnowParticle(random(0, width), random(0, height));
      this.children.push(particle);
    }
  }

  update(time) {
    this.wind.x = -0.5 + noise(time / 10000);
    this.wind.limit(0.25 * sizeScale);

    this.children.forEach((particle) => {
      particle.applyForce(this.gravity.copy().mult(particle.mass));
      particle.applyForce(this.wind);
      particle.update();
    });
  }

  draw(ctx) {
    const half = Math.ceil(this.children.length / 2);

    this.children.slice(0, half).forEach((particle) => {
      particle.draw(ctx);
    });

    drawText(ctx);

    this.children.slice(half, -1).forEach((particle) => {
      particle.draw(ctx);
    });
  }
}
class SnowParticle {
  constructor(x, y) {
    this.pos = new Vector(x, y);
    this.vel = new Vector(0, 0);
    this.acc = new Vector(0, 0);
    this.noise = new Vector(0, 0);
    this.mass = random(1, 6);
  }

  get radius() {
    return 22 * sizeScale * this.mass * 0.03; //44 = image width
  }

  applyForce(force) {
    const f = force.copy().div(this.mass);
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
    const value = random(-0.01, 0.01);
    this.noise.add(new Vector(value, 0));
    this.noise.limit(0.05);
    this.applyForce(this.noise);
  }
  update() {
    this.disturbance();
    this.drag();

    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);

    this.bounding();
  }
  draw(ctx) {
    const d = this.radius * 2;
    ctx.drawImage(
      images[0],
      this.pos.x - this.radius,
      this.pos.y - this.radius,
      d,
      d
    );
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
class StarEmitter {
  constructor() {
    this.spawn = false;
    this.maxParticles = 200;
    this.children = [];

    this.alpha = [1, 0.5];
    this.scale = [0.8, 0.1];
    this.acceleration = [0.5, 0.5];
    this.lifetime = [0.1, 0.3];
    this.color = ["#ffd8a6"];
  }

  add() {
    if (this.children.length < this.maxParticles) {
      const lifetime = random(this.lifetime[0], this.lifetime[1]);
      const child = new StarParticle(
        cursor.pos.x,
        cursor.pos.y,
        lifetime,
        this.color[0]
      );

      this.children.push(child);

      child.applyForce(
        new Vector(
          random(-this.acceleration[0], this.acceleration[0]),
          random(-this.acceleration[1], this.acceleration[1])
        )
      );
    }
  }

  update() {
    if (this.spawn) {
      this.add();
    }

    this.children.forEach((child) => {
      child.update();
      child.alpha = map(
        child.lifetime,
        0,
        child.totalLifetime,
        this.alpha[1],
        this.alpha[0]
      );
      child.scale = map(
        child.lifetime,
        0,
        child.totalLifetime,
        this.scale[1],
        this.scale[0]
      );
    });

    this.children = this.children.filter((child) => !child.isDead);
  }

  draw(ctx) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    this.children.forEach((child) => child.draw(ctx));
    ctx.restore();
  }
}
class StarParticle {
  constructor(x, y, lifetime, color) {
    this.pos = new Vector(x, y);
    this.vel = new Vector(0, 0);
    this.acc = new Vector(0, 0);
    this.rotate = random(0, Math.PI);

    this.color = color;
    this.scale;
    this.alpha;
    this.totalLifetime = lifetime;
    this.lifetime = lifetime;
    this.isDead = false;
  }

  get radius() {
    return 22 * sizeScale * 3; // 44 = image width
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.lifetime -= 0.01;
    if (this.lifetime <= 0) {
      this.isDead = true;
    }
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    const d = this.radius * 2 * this.scale;

    const buffer = document.createElement("canvas");
    buffer.width = images[1].width;
    buffer.height = images[1].height;
    const btx = buffer.getContext("2d");

    btx.fillStyle = this.color;
    btx.fillRect(0, 0, buffer.width, buffer.height);
    btx.globalCompositeOperation = "destination-atop";
    btx.drawImage(images[1], 0, 0);

    ctx.translate(this.pos.x, this.pos.y);
    ctx.rotate(this.rotate);
    ctx.drawImage(buffer, -d / 2, -d / 2, d, d);
    ctx.restore();
  }
}

let dpr = window.devicePixelRatio || 1;
let sizeScale = 1;
const cursor = new Cursor();
const snowEmitter = new SnowEmitter();
const starEmitter = new StarEmitter();

let timer = 0;
function updateMouse(event) {
  starEmitter.spawn = true;
  cursor.isMoving = true;
  clearTimeout(timer);
  timer = setTimeout(() => {
    starEmitter.spawn = false;
    cursor.isMoving = false;
  }, 250);

  mouseX = event.clientX - offsetX;
  mouseY = event.clientY - offsetY;
}
function updateCanvasSize() {
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  width = rect.width;
  height = rect.height;
  offsetX = rect.left;
  offsetY = rect.top;

  sizeScale = width / 1000;
}

function setup() {
  canvas = document.querySelector(".merry-christmas > canvas");
  ctx = document.querySelector("canvas").getContext("2d");

  images = [
    document.querySelector("#particle-snow"),
    document.querySelector("#particle-star"),
  ];

  updateCanvasSize();

  snowEmitter.setup();

  window.requestAnimationFrame(draw);
}

function drawText(ctx) {
  ctx.save();
  ctx.font = "700 clamp(2rem, 12vw, 10rem) Rouge Script";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.shadowColor = "rgba(0, 0, 0, .6)";
  ctx.shadowBlur = 2 * dpr;
  ctx.shadowOffsetX = 10 * sizeScale * dpr;
  ctx.shadowOffsetY = 10 * sizeScale * dpr;

  ctx.filter = "none";
  ctx.fillStyle = "#e6142d";
  ctx.fillText("Merry Christmas", width / 2, height / 2);
  ctx.restore();
}
function draw(time) {
  ctx.save();
  ctx.clearRect(0, 0, width * dpr, height * dpr);
  ctx.scale(dpr, dpr);

  cursor.update();
  snowEmitter.update(time);
  starEmitter.update(time);

  snowEmitter.draw(ctx);
  starEmitter.draw(ctx);
  cursor.draw(ctx);

  window.requestAnimationFrame(draw);
  ctx.restore();
}

setup();
