class Animation {
  constructor (duration, from, target) {
    this.duration = duration;
    this.time = 0;
    this.from = from;
    this.target = target;
  }

  easeInOutQuad(t) {
     return t<.5 ? 2*t*t : -1+(4-2*t)*t
   }

  update() {
    var delta = map(this.time, 0, this.duration, 0, 1);
    delta = this.easeInOutQuad(delta);
    var value = this.duration * delta;
    var t = map(value, 0, this.duration, this.from, this.target);
    this.time++;

    if (this.isDone()) {
      return this.target;
    }

    return t;
  }

  isDone() {
    return this.duration == this.time;
  }
}
