const STREAMS = [];
const FONT_SIZE = 26;
const COLORS = {};

let font;
function preload() {
  font = loadFont("RobotoMono-Regular.ttf");
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  background(0);
  textFont(font);
  textSize(FONT_SIZE);

  COLORS.green = color(0, 255, 50);
  COLORS.glow = color(219, 255, 219);

  const columns = width / FONT_SIZE;
  for (let i = 0; i <= columns; i++) {
    const startOffset = random(-1000, 0);
    const stream = new Stream(i * FONT_SIZE, startOffset);
    STREAMS.push(stream);
  }
}

function draw() {
  background(0, 50);

  STREAMS.forEach((stream) => stream.update());
  STREAMS.forEach((stream) => stream.render());
}

class Stream {
  constructor(x, y) {
    this.length = round(random(5, height / FONT_SIZE - 5));
    this.speedInterval = round(random(2, 20));
    this.glow = round(random(0, 3)) === 0;
    this.symbols = [];

    for (let i = 0; i <= this.length; i++) {
      this.symbols.push(new Symbol(x, y));
      y -= FONT_SIZE;
    }
  }

  update() {
    if (frameCount % this.speedInterval == 0) {
      const symbol = this.symbols.pop();
      symbol.y = this.symbols[0].y + FONT_SIZE;
      this.symbols.unshift(symbol);
    }

    this.symbols.forEach((symbol) => symbol.update());
  }

  render() {
    this.symbols.forEach((symbol, index) => {
      fill(
        this.glow
          ? lerpColor(COLORS.glow, COLORS.green, map(index, 0, 3, 0, 1))
          : COLORS.green
      );
      symbol.render();
    });
  }
}

class Symbol {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.value;
    this.switchInterval = round(random(100, 200));

    this.cycle();
  }

  cycle() {
    if (frameCount % this.switchInterval == 0) {
      this.value = round(random(0, 1));
      //this.value = String.fromCharCode(0x30a0 + round(random(0, 96)));
    }
  }

  update() {
    this.y = this.y >= height ? 0 : this.y;
    this.cycle();
  }

  render() {
    text(this.value, this.x, this.y);
  }
}
