class StationMouse extends GridMouse {
  constructor() {
    super();
    this.mainColor = color("#42f480");
    this.highLightColor = color(100);
    this.borderSize = 2.0;
    this.size = 20;
  }

  pressed() {
    editLine.addStation(new Station(grid.mouse.x, grid.mouse.y));
  }

  draw() {
    strokeWeight(this.borderSize);
    stroke(this.highLightColor);
    fill(this.mainColor);
    ellipse(this.x, this.y, this.size);
  }
}


class TrackMouse extends GridMouse {
  constructor() {
    super();
    this.mainColor = color("#42f480");
    this.greyColor = color(100);
    this.highLightColor = color(66, 244, 235);
    this.size = 20;
    this.highLight = false;


    this.fromStation;
    this.toStation;
    this.tracks = [];

    this.hoverStation;

    this.lastX;
    this.lastY;
  }

  pressed() {

    // Select Start Station
    if (this.fromStation == null && this.hoverStation != null) {
      this.fromStation = this.hoverStation;
    } else

    // Add Tracks
    if(this.fromStation!= null && this.hoverStation == null) {
      this.tracks.push(createVector(this.x, this.y));
    } else

    // Select End and Create Rail
    if(this.fromStation != null && this.hoverStation != null) {
      this.toStation = this.hoverStation;
      let rail = new Rail(this.fromStation, this.toStation);
      for (var i = 0; i < this.tracks.length; i++) {
        rail.buildTrack(this.tracks[i].x, this.tracks[i].y);
      }
      editLine.addRail(rail);
      this.reset();
    }

  }

  reset() {
    this.fromStation = null;
    this.toStation = null;
    this.tracks = [];
  }

  update() {
    super.update();

    // if mouse has change position in grid
    if (this.x != this.lastX || this.y != this.lastY) {
      this.lastX = this.x;
      this.lastY = this.y;

      // if marker is on a station
      this.hoverStation = editLine.getStationAt(this.x, this.y);
      if (this.hoverStation != null) {
        this.highLight = true;
      } else {
        this.highLight = false;
      }
    }
  }

  draw() {
    // Draw marker
    noFill();
    strokeWeight(4);
    if (this.highLight) {
      stroke(this.highLightColor);
    } else {
      stroke(this.greyColor);
    }
    ellipse(this.x, this.y, this.size);

    // Draw follow line
    stroke(this.mainColor);
    strokeWeight(6);
    if (this.tracks.length > 0) {
      line(this.tracks[this.tracks.length - 1].x, this.tracks[this.tracks.length - 1].y,
      this.x, this.y);
    }
    else if (this.fromStation != null) {
      line(this.fromStation.x, this.fromStation.y, this.x, this.y);
    }

    // Draw Planned Tracks
    if (this.fromStation != null && this.tracks[0] != null) {
      line(this.fromStation.x, this.fromStation.y, this.tracks[0].x, this.tracks[0].y);
    }
    for (var i = 0; i < this.tracks.length - 1; i++) {
      let track = this.tracks[i];
      let track2 = this.tracks[i + 1];
      line(track.x, track.y, track2.x, track2.y);
    }
  }
}
