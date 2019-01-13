let cb1 = 			"#28283c";
let cb2 = 			"#454559";
let clines = 		"#5a5a6e";
let ccurve = 		"#acff68"; //#f23252
let cselect = 	"#fffff";
let cselectp =	"#fffff";


let sideScroller = new SideScroller();
let noiseDataSet;
let lineChart;

function setup() {
  createCanvas(800, 800);
  noiseSeed(0);
  cursor(MOVE);
  textAlign(RIGHT);

  this.pointsSlider = createSlider(2, width, width / 2);
  this.scaleSlider  = createSlider(0, 150, 25);
  //this.pointsSlider .position( 20, height - 40);
  //this.scaleSlider  .position(160, height - 40);

  let w = 700;
  let h = w;
  lineChart = new LineChart(50, 50, w, h);
  noiseDataSet = new NoiseDataSet(h);
}

function mousePressed() {
	sideScroller.mousePressed(createVector(mouseX, mouseY));
}

function mouseDragged() {
	sideScroller.mouseDragged(createVector(mouseX, mouseY));
}

function draw() {
  background(cb1);
  lineChart.setDataSet(noiseDataSet.getDataSet());
  lineChart.draw();
}

function SideScroller() {

  this.offset = 0;

  this.dragFromX = null;

	this.mousePressed = (mouse) => {
		this.dragFromX = this.offset + mouse.x;
	}

	this.mouseDragged = (mouse) => {
  	this.offset = this.dragFromX - mouse.x;
	}
}

function LineChart(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.dataSet = null;
  this.lines = 10;
  this.min = 0;
	this.max = 1;
  this.horizontalLines = false;
  this.verticalLines = true;

  this.setDataSet = (dataSet) => {
  	this.dataSet = dataSet;
    this.min = Math.min(...this.dataSet);
		this.max = Math.max(...this.dataSet);
  }

  this.draw = () => {
    push();
    translate(this.x, this.y);
    this.drawBelowBackground();
    this.drawGrid();
    this.drawValueAxis();
  	this.drawCurve();
    this.drawSelector();
    this.drawValueMeter();
    pop();
  }

  this.colorValue = (n) => {
    let from = color("#ff1e52");
		let to   = color("#2004f2");
  	let amt  = map(n, this.min, this.max, 0, 1);

    return lerpColor(from, to, amt);
  }

  this.getPoint = (i) => {
  	return createVector(this.getX(i), this.getY(i));
  }

  this.getY = (i) => {
  	return this.dataSet[i];
  }

  this.getX = (i) => {
  	return i * this.w / (this.dataSet.length - 1);
  }

	this.drawCurve = () => {
  	strokeWeight(8);
    stroke(ccurve);
    noFill();

    for(var i = 0; i < this.dataSet.length - 1; i++) {
      let p1 = this.getPoint(i);
      let p2 = this.getPoint(i + 1);
      let yCenter = p1.y + abs(p2.y - p1.y);
      stroke(this.colorValue(yCenter));
      line(p1.x, p1.y, p2.x, p2.y);
  	}
  }

  this.drawBelowBackground = () => {
    fill(cb2);
    noStroke();

    beginShape();
    vertex(0, this.h);
    this.dataSet.forEach((y, i) => {
    	vertex(this.getX(i), y);
    });
    vertex(this.w, this.h);
    endShape(CLOSE);
  }

  this.drawSelector = () => {
    let mx = mouseX - this.x;
    let x = mx >= this.w ? this.w : mx <= 0 ? 0 : mx;

    strokeWeight(4);
    stroke(cselect);
    line(x, 0, x, this.h);

    // Get y value between two points
    let indices = this.dataSet.length - 1;
    let i = floor(map(x, 0, this.w, 0, indices - 1));
    let y = getY(x, this.getPoint(i), this.getPoint(i + 1));

    strokeWeight(2);
    stroke(0);
    fill(this.colorValue(this.dataSet[i]));
    ellipse(x, y, 20);
  }

  this.drawGrid = () => {
    stroke(clines);
    strokeWeight(2);

    for(var i = 1; i < this.lines && this.horizontalLines; i++) {
      let x = i * this.w /	this.lines;
      line(x, 0, x, this.h);
    }

    for(var j = 1; j < this.lines && this.verticalLines; j++) {
      let y = j * this.h /	this.lines;
      line(0, y, this.w, y);
    }
  }

  this.drawValueAxis = () => {
    let length = 8;
  	strokeWeight(2);
    stroke(255);
    line(0, 0, 0, this.h);
    line(0, this.h, this.w, this.h);

    for(var i = 0; i <= this.lines && (this.verticalLines || this.horizontalLines); i++) {
      let y = i * (this.h / this.lines);
      let x = i * (this.w / this.lines);

      if (this.verticalLines) line(0, y, 0 - length, y);
      if (this.horizontalLines) line(x, this.h, x, this.h + length);
    }
  }

  this.drawValueMeter = () => {
  	strokeWeight(12);
    let distance = this.max - this.min;
    let segments = floor(distance / 8);
    let segmentLength = distance/segments;
    for(var i = 0; i < segments; i++) {
      let n = this.min + segmentLength * (i + 0.5);
      stroke(this.colorValue(n));
    	line(-30, this.min + segmentLength * i, -30, this.min + segmentLength * (i + 1));
    }
  }
}

function NoiseDataSet(maxValue) {
  this.max = maxValue;
  this.dataSet = [];

	this.getDataSet = () => {
    this.generateDataSet();
    return this.dataSet;
  }

  this.generateDataSet = () => {
    let dataSet = [];
    let points = pointsSlider.value();
    for (var i = 0; i < points; i++) {
      let y = this.getNoiseValue(points - 1, i);
      dataSet.push(y);
    }
    this.dataSet = dataSet;
  }

  this.getNoiseValue = (points, i) => {
    let mScale = points / width;
    let nscale = map(scaleSlider.value(), 0, 1000, 0.001, 0.5);
    return map(noise((i + sideScroller.offset * mScale) * nscale), 0, 1, 0, this.max);
	}
}


function getX(y, a, b) {

	var m = calculateSlope(a, b);

  if (m == 0) {
  	return a.x
  }

  var c = a.y - a.x * m;
  return floor((y - c) / m);
}

function getY(x, a, b) {

	var m = calculateSlope(a, b);

  if (m === Infinity) {
  	return a.y
  }

  var c = a.y - a.x * m;
  return floor(m * x + c);
}

function calculateSlope(a, b) {
	if (b.y == a.y)
        return Infinity;

    if (b.x == a.x)
        return 0;

    return (b.y - a.y) / (b.x - a.x);
}
