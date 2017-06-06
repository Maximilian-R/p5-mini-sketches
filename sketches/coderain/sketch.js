var useFont;
var symbolSize = 26;
var streams = [];

function preload() {
  useFont = loadFont('RobotoMono-Regular.ttf');
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  background(0);

  var x = 0;
  for (var i = 0; i <= width / symbolSize; i++) {

    var stream = new Stream();
    stream.generateSymbols(x, random(-1000, 0));
    streams.push(stream);
    x += symbolSize;
  }

  textFont(useFont);
  textSize(symbolSize);
}

function draw() {
  background(0, 50);

  streams.forEach(function(stream) {
    stream.render();
  });
}

function Symbol(x, y, first) {
  this.x = x;
  this.y = y;
  this.value;
  this.first = first;

  this.switchInterval = round(random(100, 200));

  this.setToRandomSymbol = function() {
    if (frameCount % this.switchInterval == 0) {
        this.value = round(random(0,1));
      //this.value = String.fromCharCode(0x30A0 + round(random(0,96)));
    }
  }

  this.render = function() {
    if (this.first) {
      fill(180, 255, 180);
    } else {
      fill(0, 255, 50);
    }

    text(this.value, this.x, this.y);
    this.rain();
    this.setToRandomSymbol();
  }

  this.rain = function() {
    this.y = (this.y >= height) ? 0 : this.y;
  }

}

function Stream() {
  this.symbols = [];
  this.totalSymbols = round(random(5,30));
  this.speedInterval = round(random(2, 20));

  this.generateSymbols = function(x, y) {
    var first = round(random(0, 4)) == 1;
    for (var i = 0; i <= this.totalSymbols; i++) {
      symbol = new Symbol(x, y, first);
      symbol.setToRandomSymbol();
      this.symbols.push(symbol);
      y -= symbolSize;
      first = false;
    }

  }

  this.render = function() {
    //move last element below first element
    if (frameCount % this.speedInterval == 0) {
      var symbol = this.symbols.pop();


      if (this.symbols[0].first) {
        symbol.first = true;
        this.symbols[0].first = false;
      }

      symbol.y = this.symbols[0].y + symbolSize;
      this.symbols.unshift(symbol);
    }

    this.symbols.forEach(function(symbol) {
      symbol.render();
    });
  }

}
