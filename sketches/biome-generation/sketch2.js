const scale = 3.7;
const world = world50;
const size = [window.innerWidth, window.innerHeight];

/* 
  land
  height
  temperature (annual)
  precipitation (annual)
*/

function setup() {
  createCanvas(...size);
  pg = createGraphics(...size);
  stroke(0);
  strokeWeight(1);
  frameRate(1);
  background(27, 68, 122);

  //noiseSeed(0);

  dessert1 = color(255, 187, 69);
  dessert2 = color(194, 109, 6);
  forrest1 = color(6, 105, 59);
  forrest2 = color(73, 186, 122);
  winter1 = color(220);
  winter2 = color(255);
  mountain1 = color(100);
  mountain2 = color(150);

  countryMap();
  heatMap = createHeatMap();
  drawBiomes();
  createHeightMap();
}

let currentA = 0;

function draw() {
  noLoop();
  currentA = pg.get(mouseX, mouseY)[3];

  translate(window.innerWidth / 2, window.innerHeight / 2);
  //drawWorld();
}

function countryMap() {
  push();
  pg.noStroke();
  pg.translate(size[0] / 2, size[1] / 2);
  drawWorld(pg);
  pop();
  //image(pg, 0, 0);
}

function createHeatMap() {
  const d = pixelDensity();
  const img = createImage(size[0] * d, size[1] * d);
  img.loadPixels();
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      const index = (x + y * img.width) * 4;
      img.pixels[index + 3] = map(abs(y - size[1]), 0, size[1], 255, 0);
    }
  }
  img.updatePixels();
  image(img, 0, 0, ...size);
  return img;
}

function createHeightMap() {
  const d = pixelDensity();
  const img = createImage(size[0] * d, size[1] * d);
  img.loadPixels();
  const noiseDivider = 200;
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      const index = (x + y * img.width) * 4;
      const height = noise(x / noiseDivider, y / noiseDivider);
      const c = height > 0.7 ? 255 : 0;
      img.pixels[index] = c;
      img.pixels[index + 1] = c;
      img.pixels[index + 2] = c;
      img.pixels[index + 3] = 255;
    }
  }
  img.updatePixels();
  //image(img, 0, 0, ...size);
  return img;
}

function drawBiomes() {
  const img = createImage(size[0] * 2, size[1] * 2);
  img.loadPixels();
  pg.loadPixels();

  const d = pixelDensity();
  const noiseDivider = 150;

  for (let x = 0; x < pg.width * d; x++) {
    for (let y = 0; y < pg.height * d; y++) {
      const index = (x + y * pg.width * d) * 4;

      if (pg.pixels[index + 3] > 0) {
        const heat = map(heatMap.pixels[index + 3], 0, 255, -0.3, 0.3);
        const biome = noise(x / noiseDivider, y / noiseDivider) + heat;
        const biome2 = noise(y / noiseDivider, x / noiseDivider) + heat;
        const alpha = noise(y / noiseDivider, x / noiseDivider);
        const c =
          biome < 0.4
            ? biome2 > 0.5
              ? lerpColor(mountain1, mountain2, alpha)
              : lerpColor(winter1, winter2, alpha)
            : biome < 0.6
            ? lerpColor(forrest1, forrest2, alpha)
            : lerpColor(dessert1, dessert2, alpha);
        img.pixels[index] = c.levels[0];
        img.pixels[index + 1] = c.levels[1];
        img.pixels[index + 2] = c.levels[2];
        img.pixels[index + 3] = c.levels[3];
      }
    }
  }
  img.updatePixels();
  image(img, 0, 0, ...size);
}

function drawWorld(graphics) {
  let alpha = 1;

  for (const country of world.features) {
    const geometry = country.geometry;
    const isActive = alpha === currentA;
    const c = graphics
      ? color(0, 255, 0, alpha)
      : isActive
      ? color(14, 232, 218)
      : color(0, 0, 0, 255);

    alpha++;

    graphics ? graphics.fill(c) : fill(c);
    noFill();

    if (geometry.type === "Polygon") {
      const polygon = geometry.coordinates[0];
      drawPolygon(polygon, graphics);
    } else if (geometry.type === "MultiPolygon") {
      const polygons = geometry.coordinates;
      for (const polygon of polygons) {
        drawPolygon(polygon[0], graphics);
      }
    }
  }
}

function drawPolygon(polygon, graphics) {
  graphics ? graphics.beginShape() : beginShape();
  for (const coordinate of polygon) {
    graphics
      ? graphics.vertex(coordinate[0] * scale, coordinate[1] * -1 * scale)
      : vertex(coordinate[0] * scale, coordinate[1] * -1 * scale);
  }
  graphics ? graphics.endShape(CLOSE) : endShape(CLOSE);
}
