function volumeBox(x, y, h, w, d, r, g, b) {
  this.x = x;
  this.y = y;
  this.height = h;
  this.width = w;
  this.depth = d;
  this.color = [r, g, b];
  this.volume = 0;

  this.noiseX = random(0, 1000);
  this.noiseInc = 0.005;

  this.halfHeight = this.height / 2;
  this.halfWidth = this.width / 2;

  this.update = function() {
    push();
    translate(this.x, this.y, 0);
    this.drawSkelleton();
    this.calcVolume();
    this.drawVolume();
    pop();
  }

  this.calcVolume = function() {
    this.noiseX += this.noiseInc;
    percentage = noise(this.noiseX, 0, 0);
    this.volume = this.height * percentage;
  }

  this.drawVolume = function() {
    if(this.volume > 0) {
      var yOffset = (this.height - this.volume) / 2;
      fill(this.color[0], this.color[1], this.color[2], 150);
      push();
      translate(0, yOffset, 0);
      box(this.width-1, this.volume, this.width-1);
      pop();
    }
  }

  this.drawSkelleton = function() {
    fill(0);
    var h = this.halfHeight;
    var s = this.halfWidth;
    var s1 = s / 2;

    beginShape();
    vertex(-s, -h, -s);
    vertex(s, -h, -s);
    vertex(s, h, -s);
    vertex(-s, h, -s);
    vertex(-s, -h, -s);

    vertex(-s, -h, s);
    vertex(s, -h, s);
    vertex(s, h, s);
    vertex(-s, h, s);
    vertex(-s, -h, s);

    vertex(s, -h, s);
    vertex(s, -h, -s);
    vertex(s, h, -s);
    vertex(s, h, s);
    vertex(-s, h, s);
    vertex(-s, h, -s);

    endShape();
  }
}
