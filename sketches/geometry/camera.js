function navCamera() {
  //rotation
  this.lastMouseX = width / 2;
  this.lastMouseY = height / 2;
  this.beganMouseY = 0;
  this.beganMouseX = 0;
  this.xRotation = 0;
  this.yRotation = 0;

  //position
  this.zoom = 0;
  this.nx = 0;
  this.ny = 0;

  this.update = function() {
    this.checkInput();
    //adjust view
    camera(this.nx, this.ny, this.zoom);
    rotateX(-PI/2 + (PI)  * (this.yRotation / height));
    rotateY(-PI/2 + (PI)  * (this.xRotation / width));
  }

  this.checkInput = function() {
    //key input
    if(keyIsDown(87)) {
      this.ny += 10;
    }
    if(keyIsDown(83)) {
      this.ny -= 10;
    }
    if(keyIsDown(65)) {
      this.nx += 10;
    }
    if(keyIsDown(68)) {
      this.nx -= 10;
    }

    //Mouse delta
    this.xRotation = this.lastMouseX;
    this.yRotation = this.lastMouseY;
    if (mouseIsPressed) {
      var deltaX = mouseX - this.beganMouseX;
      this.xRotation += deltaX;
      var deltaY = mouseY - this.beganMouseY;
      this.yRotation += deltaY;
    }
  }

  this.onMouseWheel = function(e) {
    this.zoom += e.delta;
  }

  this.onMouseRelease = function() {
    var deltaX = mouseX - this.beganMouseX;
    var deltaY = mouseY - this.beganMouseY;
    this.lastMouseX += deltaX;
    this.lastMouseY += deltaY;
  }

  this.onMousePress = function() {
    this.beganMouseX = mouseX;
    this.beganMouseY = mouseY;
  }

}
