class Line {
  constructor(name, color) {
    this.name = name;
    this.stations = [];
    this.rails = [];
    this.trains = [];
    this.color = color;
  }

  getStationAt(x, y) {
    for (var i = 0; i < this.stations.length; i++) {
      if (this.stations[i].x == x) {
        if (this.stations[i].y == y) {
          return this.stations[i];
        }
      }
    }
    return null;
  }

  addStation(station) {
    this.stations.push(station);
  }

  buildRail(fromStation, toStation) {
    let rail = new Rail(fromStation, toStation);
    this.addRail(rail);
    return rail;
  }

  addRail(rail) {
    this.rails.push(rail);
    rail.fromStation.rails.push(rail);
    rail.toStation.rails.push(rail);
    return rail;
  }

  enterTrain() {
    var train = new Train(this);
    this.trains.push(train);
    return train;
  }

  update() {
    // Draw Rails
    stroke(this.color);
    strokeWeight(6.0);
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

    // Update Trains
    for (var i = 0; i < this.trains.length; i++) {
      this.trains[i].update();
    }
  }

  getStation(index) {
    if (index >= this.stations.length || index < 0) {
      return null;
    }
    return this.stations[index];
  }

  getStationId(station) {
    return this.stations.indexOf(station);
  }
}

class Station {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 20.0;
    this.rails = [];
  }

  getAnyRail(inDirection) {
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

  getRail(index) {
    return this.rails[index];
  }

}

class Rail {
  constructor(fromStation, toStation) {
    this.speedLimit;

    this.fromStation = fromStation;
    this.toStation = toStation;
    this.tracks = [fromStation, toStation];
  }

  buildTrack(x, y) {
    var point = createVector(x, y);
    this.tracks.splice(this.tracks.length - 1, 0, point);
  }

  getNextPoint(position, direction) {
    var index = this.tracks.indexOf(position) + direction;
    if (index > this.tracks.length - 1 || index < 0) {
      return null;
    }
    return this.tracks[index];
  }

  isPositiveDirection(station) {
    return station == this.fromStation ? true : false;
  }

  update() {
    stroke(0);
    strokeWeight(10.0);
    for (var i = 0; i < this.tracks.length; i++) {
      if (i < this.tracks.length - 1) {
        line(this.tracks[i].x, this.tracks[i].y, this.tracks[i+1].x, this.tracks[i+1].y);
      }
    }
  }
}
