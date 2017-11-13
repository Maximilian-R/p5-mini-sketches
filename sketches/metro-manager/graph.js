class TrainLine {

  constructor() {
    this.stations = [];
  }

  addStation(station) {
    this.stations.push(station);
  }

  removeStation(station) {
    var index = this.stations.indexOf(station);
    this.stations.splice(index, 1);
    while (station.rails.length) {
    }
  }

}

class Station {

  constructor() {
    this.rails = [];
  }

}

class Rail {

  constructor(start, end) {
    this.fromStation = start;
    this.toStation = end;
    this.tracks = [];
  }

}
