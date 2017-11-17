var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Composites = Matter.Composites,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    World = Matter.World,
    Constraint = Matter.Constraint,
    Bodies = Matter.Bodies;

var engine,
    world;

var wheel,
  arrow;

function setup() {
  createCanvas(800, 800);

  //angleMode(DEGREES);
  setupMatter();

  wheel = new Wheel(400, 400);
  arrow = new Arrow(400, 200);
}

const TWO_PI = Math.PI * 2;
const HALF_PI = Math.PI * 0.5;

function Wheel(x, y) {
  this.x = x;
  this.y = y;
  this.radius = 200;
  this.diameter = function() {
    return this.radius * 2;
  }
  this.segments = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven",
  "Eight", "Nine", "Ten", "Jack", "Queen", "King", "Joker"];

  this.pinRadius = 5;

  this.deltaPI = TWO_PI / this.segments.length;

  var parts = [];
  this.body = Bodies.circle(x, y, this.radius - 20, {});
  parts.push(this.body);

  var total = this.segments.length * 3;
  for (var i = 0; i < total; i++) {
    var x = this.body.position.x + (Math.cos(i / total * TWO_PI) * this.radius),
        y = this.body.position.y + (Math.sin(i / total * TWO_PI) * this.radius);

    var pin = Bodies.circle(x, y, this.pinRadius, {});
    parts.push(pin);
  }

  this.body = Matter.Body.create({
    parts: parts
  })

  this.lock = Constraint.create({
    pointA: { x: this.body.position.x, y: this.body.position.y },
    bodyB: this.body,
    stiffness: 0.7,
    length: 0
  });

  World.add(world, this.body);
  World.add(world, this.lock);

  this.spin = function() {
    var r = random(40, 100);
    Matter.Body.applyForce(this.body, {x: this.radius * 0.5, y: 0}, {x: r, y: r});
  }

  this.draw = function() {

    stroke(255);
    fill("#66402a");
    strokeWeight(2);

    var position = this.body.position;
    //var angle = (this.body.angle * (180 / Math.PI)) % 360;
    var angle = this.body.angle;

    push();
    translate(this.x, this.y);
    rotate(angle);
    var size = this.diameter() + 60;
    ellipse(0, 0, size, size);

    strokeWeight(0);
    for (var i = 0; i < this.segments.length; i++) {
      var color = (i % 2 == 0) ? "#2d3f5b" : "#f7d396";
      fill(color);
      arc(0, 0, this.radius * 2, this.radius * 2, i * this.deltaPI, (i + 1) * this.deltaPI);
    }



    strokeWeight(0);
    fill("#ffffff");
    textAlign(CENTER, CENTER);
    textSize(32);

    var textOffset = (TWO_PI / this.segments.length) / 2;
    rotate(textOffset);
    for (var i = 0; i < this.segments.length; i++) {
      text(this.segments[i], this.radius * 0.7, 0);
      rotate(TWO_PI / this.segments.length);
    }

    pop();

    push();
    translate(this.x, this.y);


    fill("#249199");
    strokeWeight(10);
    stroke("#66402a");
    ellipse(0, 0, 140, 140);

    strokeWeight(0);
    fill("#ffffff");
    textAlign(CENTER, CENTER);
    textSize(32);
    text("Spin", 0, 0);

    fill(0);
    var pins = this.body.parts;
    for (var i = 2; i < pins.length; i++) {
      var pin = pins[i];
      var x = position.x - pin.position.x;
      var y = position.y - pin.position.y;
      ellipse(x, y, this.pinRadius * 2);
    }

    pop();

  }

}

function Arrow(x, y) {
  y += 1
  this.x = x;
  this.y = y;

  this.vector = [{x: 0, y: 0}, {x: -14, y: -50},{x: 0, y: -70},
    {x: 14, y: -50}]; // , {x: 0, y: 0}

  this.body = Matter.Bodies.fromVertices(x, y - 44, this.vector);
  World.add(world, this.body);

  this.lock = Constraint.create({
    pointA: { x: this.body.position.x, y: this.body.position.y },
    bodyB: this.body,
    stiffness: 0.9,
    length: 0
  });
  World.add(world, this.lock);

  this.left = Constraint.create({
    pointA: { x: this.body.position.x, y: this.body.position.y + 100},
    bodyB: this.body,
    pointB: {x: 0, y: 35},
    stiffness: 0
  });
  World.add(world, this.left);

  // this.right = Constraint.create({
  //   pointA: { x: this.body.position.x + 40, y: this.body.position.y + 10},
  //   bodyB: this.body,
  //   pointB: {x: 0, y: 35},
  //   stiffness: 0
  // });
  // World.add(world, this.right);

  this.draw = function() {
    push();
    fill("#249199");
    stroke(0);
    translate(this.x, this.y - 40);
    rotate(this.body.angle);
    translate(0, 40);

    beginShape();
    for (var i = 0; i < this.vector.length; i++) {
      var v = this.vector[i];
      vertex(v.x, v.y);
    }
    endShape(CLOSE);
    pop();
  }
}

function draw() {
  background(255);
  wheel.draw();
  arrow.draw();
}

function setupMatter() {
  // create engine
  engine = Engine.create(),
  world = engine.world;

  // create runner
  var runner = Runner.create();
  Runner.run(runner, engine);


  // create renderer
  var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      width: Math.min(document.documentElement.clientWidth, 800),
      height: Math.min(document.documentElement.clientHeight, 600),
      showAngleIndicator: true
    }
  });

  Render.run(render);

  // add mouse control
  var mouse = Mouse.create(render.canvas),
      mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: false
          }
        }
      });

    World.add(world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // fit the render viewport to the scene
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: 800, y: 800 }
    });
}
