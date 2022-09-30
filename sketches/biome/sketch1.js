const scale = 3;

let from;
let to;
let mult;

const center = function (arr) {
  var x = arr.map((xy) => xy[0]);
  var y = arr.map((xy) => xy[1]);
  var cx = (Math.min(...x) + Math.max(...x)) / 2;
  var cy = (Math.min(...y) + Math.max(...y)) / 2;
  return [cx, cy];
};

const maxPopulation = Math.min(
  100000000,
  Math.max(...world110.features.map((c) => c.properties.pop_est))
);

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  stroke("#fff");
  strokeWeight(1);
  fill(255, 204, 0);
  frameRate(30);

  from = color(0, 255, 0, 0);
  to = color(0, 255, 0, 150);
}

function draw() {
  mult = [
    (1 / window.innerWidth) * mouseX - 0.5,
    (1 / window.innerHeight) * mouseY - 0.5,
  ];

  background("#1e4154");
  translate(window.innerWidth / 2, window.innerHeight / 2);

  for (const country of world110.features) {
    const geometry = country.geometry;
    const population = country.properties.pop_est;
    const c = lerpColor(from, to, (1 / maxPopulation) * population);
    fill(c);

    if (geometry.type === "Polygon") {
      const polygon = geometry.coordinates[0];
      drawPolygon(polygon);
    } else if (geometry.type === "MultiPolygon") {
      const polygons = geometry.coordinates;
      for (const polygon of polygons) {
        drawPolygon(polygon[0]);
      }
    }
  }
}

function drawPolygon(polygon, large = true) {
  let origin = large ? center(polygon) : undefined;
  beginShape();
  for (const coordinate of polygon) {
    if (large) {
      let c1 = coordinate[0];
      let c2 = coordinate[1];
      c1 = c1 + mult[0] * 2 * (c1 > origin[0] ? 1 : -1);
      c2 = c2 + mult[1] * 2 * (c2 > origin[1] ? 1 : -1);
      vertex(c1 * scale, c2 * -1 * scale);
    } else {
      vertex(coordinate[0] * scale, coordinate[1] * -1 * scale);
    }
  }
  endShape(CLOSE);
}
