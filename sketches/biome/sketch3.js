const scale = 3;
const world = world110;
const size = [window.innerWidth, window.innerHeight];

/* 
  https://www.nature.com/scitable/knowledge/library/terrestrial-biomes-13236757/

  land
  temperature (annual)
  
  add dynamically by clicking
  precipitation (annual)

*/

function getBiome(height, temp, pre) {
  if (height < 0) {
    return water;
  }

  if (temp < -7) {
    if (pre < 10) {
      return tundra;
    } else {
      return snow;
    }
  } else if (temp < 3) {
    if (pre < 10) {
      return desert;
    } else if (pre < 50) {
      return meditteraen;
    } else if (pre < 150) {
      return northernForest;
    } else if (pre < 160) {
      return tundra;
    } else {
      return snow;
    }
  } else if (temp < 17) {
    if (pre < 40) {
      return desert;
    } else if (pre < 60) {
      return meditteraen;
    } else if (pre < 120) {
      return grassland;
    } /* if (pre < 320) */ else {
      return decidiousForest;
    }
  } else if (temp < 30) {
    if (pre < 45) {
      return desert;
    } else if (pre < 80) {
      return savanna;
    } else {
      return tropicalForest;
    }
  }
  return outOfRange;
}

function setup() {
  createCanvas(...size);

  frameRate(1);

  //noiseSeed(0);

  desert = color(226, 131, 86);
  tundra = color(72, 142, 176);
  snow = color(255);
  meditteraen = color(157, 180, 182);
  northernForest = color(9, 94, 48);
  grassland = color(116, 162, 84);
  savanna = color(191, 186, 162);
  decidiousForest = color(60, 115, 70);
  tropicalForest = color(44, 68, 30);
  water = color(16, 34, 122);
  outOfRange = color(0);

  //landMap = createLand();
  // temperatureMap = createTemperatureMap();
  // precipitationMap = createPrecipitationMap();
  drawBiomes();

  //image(landMap, 0, 0);
  //image(temperatureMap, 0, 0, ...size);
  //image(precipitationMap, 0, 0, ...size);
}

function draw() {
  noLoop();
  //translate(window.innerWidth / 2, window.innerHeight / 2);
  //drawWorld();
}

function createLand() {
  const pg = createGraphics(...size);

  push();
  pg.translate(size[0] / 2, size[1] / 2);
  drawWorld(pg);
  pop();

  return pg;
}

// function createTemperatureMap() {
//   const d = pixelDensity();
//   const img = createImage(size[0] * d, size[1] * d);
//   img.loadPixels();
//   for (let y = 0; y < img.height; y++) {
//     for (let x = 0; x < img.width; x++) {
//       const index = (x + y * img.width) * 4;

//       const modify = noise(x / 150, y / 150);
//       const temp = map(abs(y - size[1]), 0, size[1], -40, 40) * modify;
//       const alpha = map(temp, -50, 50, 255, 0);

//       img.pixels[index + 3] = alpha;
//     }
//   }
//   img.updatePixels();
//   return img;
// }

// function createPrecipitationMap() {
//   const d = pixelDensity();
//   const img = createImage(size[0] * d, size[1] * d);
//   img.loadPixels();
//   for (let y = 0; y < img.height; y++) {
//     for (let x = 0; x < img.width; x++) {
//       const index = (x + y * img.width) * 4;

//       img.pixels[index + 3] = alpha;
//     }
//   }
//   img.updatePixels();
//   return img;
// }

function drawBiomes() {
  const d = pixelDensity();
  const img = createImage(size[0] * d, size[1] * d);
  img.loadPixels();

  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      const index = (x + y * img.width) * 4;

      const noise1 = noise(x / 300, y / 300);
      const height = map(noise1, 0, 1, -15000, 15000);

      const noise2 = noise(x / 300, y / 300);
      const precipitation = map(noise2, 0.4, 1, 0, 500);

      const noise3 = noise(x / 300, y / 300);
      const temperature = map(noise3, 0.2, 0.7, -40, 40);

      const c = getBiome(height, temperature, precipitation);

      img.pixels[index] = c.levels[0];
      img.pixels[index + 1] = c.levels[1];
      img.pixels[index + 2] = c.levels[2];
      img.pixels[index + 3] = c.levels[3];
    }
  }
  img.updatePixels();
  image(img, 0, 0, ...size);
}

function drawWorld(graphics) {
  function drawPolygon(polygon) {
    graphics.beginShape();
    for (const coordinate of polygon) {
      graphics.vertex(coordinate[0] * scale, coordinate[1] * -1 * scale);
    }
    graphics.endShape(CLOSE);
  }

  const landColor = color(0, 255);
  graphics.fill(landColor);
  graphics.stroke(landColor);
  graphics.strokeWeight(1);

  for (const country of world.features) {
    const geometry = country.geometry;
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
