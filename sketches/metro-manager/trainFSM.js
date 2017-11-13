class TrainFSM {
  constructor() {
    this.internalTime = 0;
  }

  update(train) {
    this.internalTime += 1;
  }
}

class Drive extends TrainFSM {

  update(train) {
    super.update();

    // Go Towards Destionation if exsisting
    if (train.to != null && train.from != null) {
      // Basic values
      var distance = dist(train.from.x, train.from.y, train.to.x, train.to.y);
      var totalTime = distance / train.speed;
      var positionValue = constrain(this.internalTime / totalTime, 0.0, 1.0);

      // Calculate Position
      train.x = lerp(train.from.x, train.to.x, positionValue);
      train.y = lerp(train.from.y, train.to.y, positionValue);

      // Reached Target Handling
      if (positionValue == 1) {
        this.getNextTarget(train);
      }
    }
  }

  getNextTarget(train) {
    train.from = train.to;
    train.to = null;

    var next = train.onRail.getNextPoint(train.from, train.direction);

    if (next == null) { // Reached a Station
      train.atStation = train.from;
      train.state = new LoadUnload();
      train.onRail = train.atStation.getAnyRail(train.direction);
      if (train.onRail == null) {   //Change direction if end reached
        train.direction *= -1;
        train.onRail = train.atStation.getAnyRail(train.direction);
      }
      next = train.onRail.getNextPoint(train.atStation, train.direction);
    } else {
      this.internalTime = 0;
    }

    train.to = next;
    }
}

class WaitFor extends TrainFSM {
  constructor(duration) {
    super();
    this.wait = duration;
  }

  update(train) {
    super.update();

    if(this.internalTime >= this.wait) {
      train.state = new Drive(train);
    }
  }
}

class LoadUnload extends WaitFor {
  constructor() {
    super(10);
  }
}
