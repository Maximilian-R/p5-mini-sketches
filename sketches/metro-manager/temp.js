var lines = [];
var grid;

function setup() {
  var ctx = createCanvas(window.innerWidth, window.innerHeight);
  rectMode(CENTER);

  grid = new Grid();

  var line = new Line("DEMO line", color("#42f480"));
  lines.push(line);
  line.addStation(new Station(100, 200));
  line.addStation(new Station(300, 200));
  line.addStation(new Station(500, 200));
  line.addStation(new Station(700, 400));
  line.addStation(new Station(700, 500));
  line.addStation(new Station(700, 600));
  line.addStation(new Station(700, 900));
  line.addStation(new Station(400, 900));

  line.addStation(new Station(700, 200));
  line.addStation(new Station(900, 200));

  line.buildRail(line.getStation(0), line.getStation(1));
  line.buildRail(line.getStation(1), line.getStation(2));
  line.buildRail(line.getStation(2), line.getStation(3)).buildTrack(500, 400);
  line.buildRail(line.getStation(3), line.getStation(4));
  line.buildRail(line.getStation(4), line.getStation(5));
  line.buildRail(line.getStation(5), line.getStation(6));
  line.buildRail(line.getStation(6), line.getStation(7));

  line.buildRail(line.getStation(2), line.getStation(8));
  line.buildRail(line.getStation(8), line.getStation(9));

  line.enterTrain();

  var line = new Line("DEMO line 2", color("#ffb177"));
  lines.push(line);
  line.addStation(new Station(1300, 100));
  line.addStation(new Station(1300, 400));
  line.addStation(new Station(1000, 600));
  line.addStation(new Station(1000, 800));


  line.buildRail(line.getStation(0), line.getStation(1));
  var rail = line.buildRail(line.getStation(1), line.getStation(2));
  line.buildRail(line.getStation(2), line.getStation(3));

  rail.buildTrack(1300, 450);
  rail.buildTrack(1000, 450);
  rail.buildTrack(900, 600);

  line.enterTrain();
}

function draw() {
  background(240);
  strokeCap(ROUND);

  for (var i = 0; i < lines.length; i++) {
    lines[i].update();
  }

  grid.update();
}

function Grid() {
  this.gridSize = 50;
  this.pointerSize = 10;
  this.gridMarkerSize = 2;

  this.update = function() {
    let gridW = width / this.gridSize;
    let gridH = height / this.gridSize;

    // Draw grid
    stroke(0);
    strokeWeight(this.gridMarkerSize);
    for (var i = 0; i < gridW; i++) {
      for (var j = 0; j < gridH; j++) {
        //point(i * width / gridW, j * height / gridH);
      }
    }
    var helaX = floor(mouseX / this.gridSize);
    var helaY = floor(mouseY / this.gridSize);
    var restX = mouseX % this.gridSize;
    var restY = mouseY % this.gridSize;
    if (restX >= this.gridSize/2) {
      helaX += 1;
    }
    if (restY >= this.gridSize/2) {
      helaY += 1;
    }

    // Draw grid pointer
    stroke(0);
    strokeWeight(this.pointerSize);
    point(helaX * width / gridW, helaY * height / gridH);
  }
}

function Drive() {
  this.internalTime = 0;

  this.update = function(train) {
    this.internalTime += 1;

    // Go Towards Destionation if exsisting
    if (train.to != null && train.from != null) {
      // Basic values
      var distance = dist(train.from.x, train.from.y, train.to.x, train.to.y);
      var totalTime = distance / train.speed;
      var positionValue = constrain(this.internalTime / totalTime, 0.0, 1.0);

      // Calculate Position
      train.x = lerp(train.from.x, train.to.x, positionValue);
      train.y = lerp(train.from.y, train.to.y, positionValue);

      // Reached Destionation Handling
      if (positionValue == 1) {
        train.from = train.to;
        train.to = null;
        train.setNextTarget();
      }
    }
  }
}

function WaitFor(duration) {
  this.wait = duration;
  this.internalTime = 0;

  this.update = function(train) {
    this.internalTime += 1;
    if(this.internalTime >= this.wait) {
      train.state = new Drive(train);
    }
  }
}

function Stop(train) {
  this.update = function() {
  }
}



function Train(onLine) {
  this.line = onLine;
  this.direction = 1;

  this.to;
  this.from = this.line.getStation(0);
  this.onRail = this.from.getAnyRail(this.direction);
  this.x = this.from.x;
  this.y = this.from.y;

  this.speed = 4;
  this.color = this.line.color;
  this.time = 0;

  this.state = new WaitFor(50);

  this.update = function() {
    this.time += 1;

    this.state.update(this);

    this.draw();
  }

  this.draw = function() {
    // Draw
    noStroke();
    fill(this.color);
    var angle = atan2(this.to.y - this.y, this.to.x - this.x);
    push();
    translate(this.x, this.y);
    rotate(angle);
    rect(0, 0, 30, 20);
    pop();
  }

  this.setNextTarget = function() {
    var next = this.onRail.getNextPoint(this.from, this.direction);

    if (next == null) { //nått en station
      this.state = new WaitFor(50);
      this.onRail = this.from.getAnyRail(this.direction);
      if (this.onRail == null) {   //Change direction if end reached
        this.direction *= -1;
        this.onRail = this.from.getAnyRail(this.direction);
      }
      next = this.onRail.getNextPoint(this.from, this.direction);
    } else {
      this.state = new Drive();
    }

    this.to = next;
  }
}

function Line(name, color) {
  this.name = name;
  this.stations = [];
  this.rails = [];
  this.trains = [];
  this.color = color;

  this.addStation = function(station) {
    this.stations.push(station);
  }

  this.buildRail = function(fromStation, toStation) {
    var rail = new Rail(fromStation, toStation);
    this.rails.push(rail);
    fromStation.rails.push(rail);
    toStation.rails.push(rail);
    return rail;
  }

  this.enterTrain = function() {
    var train = new Train(this);
    this.trains.push(train);
    train.setNextTarget();
  }

  this.update = function() {
    // Draw Lines
    stroke(this.color);
    strokeWeight(10.0);
    for (var i = 0; i < this.rails.length; i++) {
      var rail = this.rails[i];
      for (var j = 0; j < rail.tracks.length - 1; j++) {
        var begin = rail.tracks[j];
        var end = rail.tracks[j + 1];
        line(begin.x, begin.y, end.x, end.y);
      }
    }

    // Draw stations
    strokeWeight(2.0);
    stroke(0);
    noStroke();
    fill(this.color);
    for (var i = 0; i < this.stations.length; i++) {
      var station = this.stations[i];
      ellipse(station.x, station.y, station.size);
    }

    for (var i = 0; i < this.trains.length; i++) {
      this.trains[i].update();
    }
  }

  this.getStation = function(index) {
    if (index >= this.stations.length || index < 0) {
      return null;
    }
    return this.stations[index];
  }

  this.getStationId = function(station) {
    return this.stations.indexOf(station);
  }
}

function Station(x, y) {
  this.x = x;
  this.y = y;
  this.size = 30.0;
  this.rails = [];

  this.getAnyRail = function(inDirection) {
    var positiveDirectionRails = [];
    var negativeDirectionRails = [];

    for (var i = 0; i < this.rails.length; i++) {
      var rail = this.rails[i];
      if (rail.isPositiveDirection(this)) {
        positiveDirectionRails.push(rail);
      } else {
        negativeDirectionRails.push(rail);
      }
    }

    if (inDirection == 1) {
      return random(positiveDirectionRails);
    }

    return random(negativeDirectionRails);
  }

  this.getRail = function(index) {
    return this.rails[index];
  }

}

function Rail(fromStation, toStation) {

  this.fromStation = fromStation;
  this.toStation = toStation;
  this.tracks = [fromStation, toStation];

  this.buildTrack = function(x, y) {
    var point = createVector(x, y);
    this.tracks.splice(this.tracks.length - 1, 0, point);
  }

  this.getNextPoint = function(position, direction) {
    var index = this.tracks.indexOf(position) + direction;
    if (index > this.tracks.length - 1 || index < 0) {
      return null;
    }
    return next = this.tracks[index];
  }

  this.isPositiveDirection = function(station) {
    return station == this.fromStation ? true : false;
  }

  this.update = function() {
    stroke(0);
    strokeWeight(10.0);
    for (var i = 0; i < this.tracks.length; i++) {
      if (i < this.tracks.length - 1) {
        line(this.tracks[i].x, this.tracks[i].y, this.tracks[i+1].x, this.tracks[i+1].y);
      }
    }
  }
}
