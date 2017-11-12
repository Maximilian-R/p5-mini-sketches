class Clock {

  constructor() {
    /* Take a stamp of time when starting, then use millis() to count forward
    for a more smooth transation. */
    this.startSecond = second();
    this.startMinute = minute() + this.startSecond/60;
    this.startHour = hour() + this.startMinute/60;
    this.second = 0;
    this.minute = 0;
    this.hour = 0;

    if (debugOn) {
      this.startSecond = 55;
      this.startMinute = 59 + this.startSecond/60;
      this.startHour = 23 + this.startMinute/60;
    }
  }

  update() {
    var milli = millis(); // ms from program start
    this.second = (this.startSecond + milli/1000) % 60;
    this.minute = (this.startMinute + milli/1000/60) % 60;
    this.hour = (this.startHour + milli/1000/60/60) % 24;

    if(debugOn) {
      this.debug();
    }
  }

  debug() {
    /* Debugging */
    textAlign(CENTER);
    stroke(255);
    fill(255);
    text("h: " + nf(this.hour, 1, 1) + " m: " + nf(this.minute, 1, 1) + " s:" + nf(this.second, 1, 1), width * 0.5, 10);
  }
}

class ProgressBarClock extends Clock {
  constructor() {
    super();

    var theme = ['#c9e8a3', '#73d4fa', '#fb9673', '#fc72a5'];
    this.hourWatch = new Watch("Hour", this.hour, 24, width * 0.25, 200, color(theme[0]));
    this.minuteWatch = new Watch("Minute", this.minute, 60, width * 0.5, 200, color(theme[1]));
    this.secondWatch = new Watch("Second", this.second, 60, width * 0.75, 200, color(theme[2]));
  }

  update() {
    super.update();
    this.hourWatch.update(this.hour);
    this.minuteWatch.update(this.minute);
    this.secondWatch.update(this.second);
  }
}



class Watch extends ProgressCircle {
  constructor(label, start, max, x, y, c) {
    super(label, start, max, x, y, c);
    this.operation = new NormalOperation();
  }

  valueLabel() {
    return nf(this.current, 1, 1);
  }

  update(time) {
    this.operation.update(this, time);
    this.draw();
  }
}


class WatchOperation {
  update(watch) {}
}

class NormalOperation extends WatchOperation {
  constructor() {
    super();
    this.lastTime = 0;
  }

  update(watch, time) {
    if (time < this.lastTime) {
      watch.operation = new RewindOperation(watch.max, 0);
      return;
    }
    watch.setValue(time);
    this.lastTime = time;
  }
}


class RewindOperation extends WatchOperation {
  constructor (from, target) {
    super();
    this.animation = new Animation(200, from, target);
  }

  update(watch, time) {
    this.animation.target = time;
    var t = this.animation.update();
    watch.setValue(t);

    if (this.animation.isDone()) {
      watch.operation = new NormalOperation();
    }

  }
}
