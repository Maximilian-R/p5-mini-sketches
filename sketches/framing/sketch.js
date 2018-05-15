var img;

function preload() {
  img = loadImage("obama.jpg");
}

function setup(){
  //pixelDensity(1.0);
  canvas = createCanvas(windowWidth, windowHeight);
  updateImage();
}

function draw() {
  image(img, 0, 0);
}


function updateImage() {
  img.loadPixels();

  for (var i = 0; i < img.pixels.length; i+=4) {
    red1 = img.pixels[i];
    green1 = img.pixels[i + 1];
    blue1 = img.pixels[i + 2];

    if (green1 > red1 + blue1) {
      img.pixels[i] = 255;
      img.pixels[i + 1] = 255;
      img.pixels[i + 2] = 255;
    }
  }

  img.updatePixels();

}

function within(v, min, max) {
  if(v >= min && v <= max) {
    return true;
  }
  return false;
}
