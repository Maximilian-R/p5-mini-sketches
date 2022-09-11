var img;
var imgIcon;
var pixelSize = 16;
var maxPixels = 1000000;
var minPixels = 250000;

function preload() {
  imgIcon = loadImage("imageicon.png");
}

function setup() {
  var canvas_ = createCanvas(window.innerWidth, window.innerHeight);
  canvas_.drop(receiveFile);

  resetScreen('Drag image here');
}

function resetScreen(text1) {
  background(230);
  fill(0);
  noStroke();
  textSize(24);
  textAlign(CENTER);
  text(text1, width/2, height/2);
  image(imgIcon, width/2 - imgIcon.width / 2, height/2 - imgIcon.height * 1.2);
}

function draw() {
  // img.loadPixels();
  //
  // for (var i = 0; i < 100000; i++) {
  //   var x = int(random(img.width));
  //   var y = int(random(img.height));
  //
  //   var off = (x + y * img.width) * 4;
  //   var pixs = [img.pixels[off + 0], img.pixels[off + 1],
  //               img.pixels[off + 2], img.pixels[off + 3]];
  //   fill(pixs);
  //   var s = int(random(16, 24));
  //   ellipse(x, y, s, s);
  // }
}

function receiveFile(file) {
  if (file.type === 'image') {
    img = createImg(file.data, imageLoaded).hide();
  }

  resetScreen('Processing...');
}

function highlightOn() {
  resetScreen('Drop');
}

function highlightOff() {
  resetScreen('Drag image here');
}

function imageLoaded() {
  if(img.width * img.height < minPixels) {
    resetScreen('Image resolution to small');
    return;
  }

  var cnv = select('canvas');
  var ctx = cnv.elt.getContext('2d');
  ctx.drawImage(img.elt, 0, 0);
  var rgba = ctx.getImageData(0, 0, img.width, img.height).data;
  paintImage(rgba);
}

function paintImage(pixels) {
  background(230);

  for (var i = 0; i < pixels.length / pixelSize && i < maxPixels; i++) {
    var x = int(random(img.width));
    var y = int(random(img.height));
    var off = (x + y * img.width) * 4;
    var pixs = [pixels[off + 0], pixels[off + 1],
                pixels[off + 2], pixels[off + 3]];
    fill(pixs);
    ellipse(x, y, pixelSize, pixelSize);
  }
}
