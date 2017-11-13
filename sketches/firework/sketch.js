var gui;
var fireWorks = [];

var data;
var gui1;

var datatings = function() {
this.color1 = '#190dd2';
this.color2 = '#eb0fb7';
this.color3 = '#01caf5';
this.minParticles = 50;
this.maxParticles = 100;

this.trailColor = '#ffffff';
this.trailSize = 6;
this.trailVelX = 5;
this.trailVelY = 16;

this.particleVelMin = 12;
this.particleVelMax = 25;

this.particleFriction = 0.9;
this.particleSize = 4;
this.particleGravityY = 0;

this.particleDrainMin = 0.01;
this.particleDrainMax = 0.03;

this.BGalpha = 0.2;
this.BGcolor = '#000000';

this.spawnRate = 20;
this.gravity = 0.2;
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  gravity = 0.2;
  stroke(255);
  strokeWeight(4);
  background(0);

  colorMode(RGB);

  data = new datatings();
  gui1 = new dat.GUI();


  gui1.add(data, 'spawnRate', 1, 50).step(1);

  var f0 = gui1.addFolder('Colors');
  var f1 = gui1.addFolder('Trail');
  var f2 = gui1.addFolder('Particle');

  f0.addColor(data, 'color1');
  f0.addColor(data, 'color2');
  f0.addColor(data, 'color3');
  f0.addColor(data, 'trailColor');
  f0.addColor(data, 'BGcolor');
  f0.add(data, 'BGalpha', 0, 1);

  f2.add(data, 'gravity', -0.2, 0.4);
  f2.add(data, 'minParticles', 1, 1000).step(1);
  f2.add(data, 'maxParticles', 1, 1000).step(1);
  f1.add(data, 'trailSize', 1, 20).step(1);
  f2.add(data, 'particleSize', 1, 20).step(1);
  f1.add(data, 'trailVelX', 0, 20).step(1);
  f1.add(data, 'trailVelY', 1, 40).step(1);
  f2.add(data, 'particleVelMin', 0, 100);
  f2.add(data, 'particleVelMax', 0, 100);
  f2.add(data, 'particleFriction', 0.5, 1);
  f2.add(data, 'particleDrainMin', 0.005, 0.050);
  f2.add(data, 'particleDrainMax', 0.005, 0.050);

  f0.open();
  f1.open();
  f2.open();

}

function draw() {
  var c = color(data.BGcolor).levels;
  background('rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + data.BGalpha +')');
  noStroke();

  for (var i = fireWorks.length - 1; i >= 0; i--) {
    fireWorks[i].update();
    fireWorks[i].show();

    if (fireWorks[i].done()) {
      fireWorks.splice(i, 1);
    }
  }

  if (frameCount % (51 - data.spawnRate) == 0) {
      fireWorks.push(new FireWork());
  }
}
