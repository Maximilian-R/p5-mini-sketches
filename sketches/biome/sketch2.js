const scale = 3.7;
const world = world50;
const size = [window.innerWidth, window.innerHeight];

function setup() {
  createCanvas(...size);
  stroke(0);
  strokeWeight(1);
  frameRate(1);

  //noiseSeed(0);
  water1 = color(27, 68, 122);
  dessert1 = color(255, 187, 69);
  dessert2 = color(194, 109, 6);
  forrest1 = color(6, 105, 59);
  forrest2 = color(73, 186, 122);
  winter1 = color(220);
  winter2 = color(255);
  mountain1 = color(100);
  mountain2 = color(150);

  const countryMap = createCountryMap();
  const heatMap = createHeatMap();
  const heightMap = createHeightMap();
  const biomeMap = createBiomesMap(countryMap, heatMap, heightMap);

  //background(27, 68, 122);
  //image(countryMap, 0, 0, ...size);
  //image(heatMap, 0, 0, ...size);
  //image(heightMap, 0, 0, ...size);
  image(biomeMap, 0, 0, ...size);
}

function draw() {
  //noLoop();
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
      const c = color(0, 0, 0, height * 255);

      img.pixels[index] = c.levels[0];
      img.pixels[index + 1] = c.levels[1];
      img.pixels[index + 2] = c.levels[2];
      img.pixels[index + 3] = c.levels[3];
    }
  }
  img.updatePixels();
  return img;
}

function createBiomesMap(borderMap, heatMap, heightMap) {
  const d = pixelDensity();
  const img = createImage(size[0] * d, size[1] * d);
  img.loadPixels();
  borderMap.loadPixels();

  const noiseDivider = 150;

  for (let x = 0; x < borderMap.width * d; x++) {
    for (let y = 0; y < borderMap.height * d; y++) {
      const index = (x + y * borderMap.width * d) * 4;

      // only draw biome on land - sea has a value of 0
      if (borderMap.pixels[index + 3] > 0) {
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

        const height = map(heightMap.pixels[index + 3], 0, 255, -50, 50);
        img.pixels[index] = c.levels[0] + height;
        img.pixels[index + 1] = c.levels[1] + height;
        img.pixels[index + 2] = c.levels[2] + height;
        img.pixels[index + 3] = c.levels[3];
      } else {
        const height = map(heightMap.pixels[index + 3], 0, 255, 0, -50);
        const c = water1;
        img.pixels[index] = c.levels[0] + height;
        img.pixels[index + 1] = c.levels[1] + height;
        img.pixels[index + 2] = c.levels[2] + height;
        img.pixels[index + 3] = c.levels[3];
      }
    }
  }
  img.updatePixels();
  return img;
}

function createCountryMap() {
  const graphics = createGraphics(...size);

  push();
  graphics.noStroke();
  graphics.translate(size[0] / 2, size[1] / 2);

  let alpha = 1;

  for (const country of world.features) {
    const geometry = country.geometry;
    let c = color(255, 255, 255, alpha++);
    graphics.fill(c);

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

  pop();
  return graphics;
}

function drawPolygon(polygon, img) {
  img.beginShape();
  for (const coordinate of polygon) {
    img.vertex(coordinate[0] * scale, coordinate[1] * -1 * scale);
  }
  img.endShape(CLOSE);
}
