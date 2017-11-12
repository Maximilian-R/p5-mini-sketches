class Progress {
  constructor(max, start = 0) {
    this.max = max;
    this.current = start;
  }

  percentage() {
    return nf(map(this.current, 0, this.max, 0, 100), 2, 1);
  }

  setValue(value) {
    if (value > this.max) {
      this.current = this.max;
    } else if (value < 0) {
      this.current = 0;
    } else {
      this.current = value;
    }
    return this.current;
  }
}

class VisualProgress extends Progress {
  constructor(label, start, max, x, y, c) {
    super(max, start);
    this.label = label;
    this.x = x;
    this.y = y;
    this.color = c;
    this.animation;
    this.visualValue = start;
  }

  percentage() {
    return nf(map(this.visualValue, 0, this.max, 0, 100), 2, 1);
  }

  valueLabel() {
    return this.percentage() + '%';
  }

  setValue(value, animate = false) {
    var previous = this.current;
    value = super.setValue(value);
    if (animate) {
      //this.visualValue = previous;
      this.animation = new Animation(100, this.visualValue, value);
    } else {
      this.visualValue = value;
    }
  }

  update() {
    if (this.animation) {
      this.visualValue = this.animation.update();
      if (this.animation.isDone()) {
        this.animation = null;
        this.visualValue = this.current;
      }
    }
    this.draw();
  }

  draw() {
    print("No Implmentation");
  }
}

class ProgressCircle extends VisualProgress {
  constructor(label, start, max, x, y, c) {
    super(label, start, max, x, y, c);
    this.size = 150;

    angleMode(DEGREES);
    strokeCap(SQUARE);
    textAlign(CENTER);
  }

  draw() {
    push();
    translate(this.x, this.y);

    /* Circle background color */
    fill(color('#2b3544'));
    ellipse(0, 0, this.size);

    /* Labels */
    noStroke();
    fill(this.color);
    textSize(28);
    text(this.valueLabel(), 0, textAscent() * 0.5);
    fill(color('#2b3544'));
    text(this.label, 0, - this.size * 0.5 - textAscent());

    /* Progress Circle */
    rotate(-90);
    noFill();

    let angle = map(this.visualValue, 0, this.max, 0, 360);
    if (this.visualValue != 0) {
      strokeWeight(20);
      stroke(this.color);
      arc(0, 0, this.size + 10, this.size + 10, 0, angle);
    }
    if (this.visualValue != this.max) {
      strokeWeight(10);
      stroke(210);
      arc(0, 0, this.size, this.size, angle, 0);
    }
    pop();
  }
}


class ProgressBar extends VisualProgress {
  constructor(label, start, max, x, y, c) {
    super(label, start, max, x, y, c);
    this.width = 150;
    this.height = 20;
  }

  draw() {
    print("No Implementation");
  }
}
