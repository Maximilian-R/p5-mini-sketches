var glassesIMG;
var tennisballIMG;
var stareAt;

function preload() {
  glassesIMG = loadImage("img/eyeglasses.png");
  tennisballIMG = loadImage("img/tennisball.png");
}

function setup(){
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-holder');
  imageMode(CENTER);

  noCursor();
  createGlasses();
  stareAt = createVector(width / 2, height / 2);
}

function createGlasses() {
  g = [];
  var size = 200;
  var m = size/2; //margin
  var loop = 0;

  for (var ph = size/4; ph < height; ph += size/2) {
    for (var pw = size/2 + m - size; pw < width + size; pw += size + m) {
      var offset = loop % 2 == 0 ? 0 : m * 1.5;
      g.push(new glas(pw + offset, ph));
    }
    loop++;
  }
}

function draw(){
  //background(255, 211, 238);
  background(203, 242, 220);
  //background(247, 215, 202);
  //background(42, 167, 162);
  g.forEach(function(glas) {
    glas.draw();
  });


  stareAt = createVector(mouseX, mouseY);

  image(tennisballIMG, stareAt.x, stareAt.y, 60, 60);

}

function glas(x, y) {
  this.position = createVector(x, y);
  this.size = 200;
  this.eyeColor = color( random(50, 255), random(50, 255), random(50, 255) );
  this.eye1 = new eyeball(x - this.size/4, y, this.eyeColor);
  this.eye2 = new eyeball(x + this.size/4, y, this.eyeColor);

  this.draw = function() {
    push();
    translate(this.position.x, this.position.y);
    image(glassesIMG, 0, 0, this.size, this.size);
    pop();

    this.eye1.draw();
    this.eye2.draw();
  }
}

function eyeball(x, y, c) {
  this.position = createVector(x, y);
  this.size = 40;
  this.coloreyeSize = this.size/2;
  this.pupilSize = this.coloreyeSize * 0.6;
  this.angle = 0;
  this.color = c;

  this.draw = function() {
    var p1 = this.position;

    this.angle = atan2(stareAt.y - p1.y, stareAt.x - p1.x);

    push();
    noStroke();

    fill(255);
    translate(p1.x, p1.y);
    ellipse(0, 0, this.size);

    var r = this.size/2 - this.coloreyeSize / 2;
    var d = dist(p1.x, p1.y, stareAt.x, stareAt.y);
    d = constrain(d * 0.05, 0, r);

    fill(this.color);
    rotate(this.angle);
    ellipse(d, 0, this.coloreyeSize);
    fill(0);
    ellipse(d, 0, this.pupilSize);

    pop();
  }
}
