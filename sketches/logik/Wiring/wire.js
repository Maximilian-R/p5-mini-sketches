class Connection extends ElectricComponent {
    constructor(input, output = null) {
      super(0, 0);
      this.input; // OutputSocket
      this.output; // InputSocket
      this.setInput(input);
      if (this.output) this.setOutput(output);
      //this.power = 0;
      this.thickness = 6;
      this.endPosition = this.input.getGlobalPosition(); // Used for end of connection when no output exists
    }
  
    prepareState() {
      if (this.input.power !== 0 && this.power !== this.input.power) {
        this.nextState = new State(this.input.power);
      } else if (this.input.power === 0 && this.power !== 0) {
        this.nextState = new State(0);
      }
    }
  
    setInput(outputSocket) {
      this.input = outputSocket;
      this.input.connect(this);
    }
  
    setOutput(inputSocket) {
      this.output = inputSocket;
      this.output.connect(this);
    }
  
    canSelect() { return false; }
  
    remove() {
      var index = this.input.connections.indexOf(this);
      this.input.connections.splice(index, 1);
      if(this.output) this.output.connections.pop();
      super.remove();
    }
  
    //getPower() { return this.power; }
    setPower(power) { this.power = power; }
    isOn() { return this.power != 0; }
  
    draw() {
      super.draw();
      if (this.isOn()) {
        stroke('#7DF9FF');
      } else {
        stroke('#2b3544');
      }
      strokeCap(PROJECT);
      strokeWeight(this.thickness);
      noFill();
  
      //var endPoint = this.output ? this.output.getGlobalPosition() : this.endPosition;
      //var startPoint = this.input.getGlobalPosition();
      let startOffset = createVector(this.input.width / 2, this.input.height / 2);
      let startPoint = this.input.getGlobalPosition().add(startOffset);
  
      let endPoint;
      if (this.output) {
        let endOffset = createVector(this.output.width / 2, this.output.height / 2);
        endPoint = this.output.getGlobalPosition().add(endOffset);
      } else {
        endPoint = this.endPosition;
      }
  
      line(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
  
      /* if (startPoint.x < endPoint.x) {
        var middleX = (endPoint.x - startPoint.x) / 2;
        line(startPoint.x, startPoint.y, startPoint.x + middleX, startPoint.y);
        line(startPoint.x + middleX, startPoint.y, endPoint.x - middleX, endPoint.y);
        line(endPoint.x, endPoint.y, endPoint.x - middleX, endPoint.y);
      } else {
        line(startPoint.x, startPoint.y, startPoint.x + 10, startPoint.y);
        var middleY = (endPoint.y - startPoint.y) / 2;
        line(startPoint.x + 10, startPoint.y, startPoint.x + 10, startPoint.y + middleY);
        line(startPoint.x + 10, startPoint.y + middleY, endPoint.x - 10, startPoint.y + middleY);
        line(endPoint.x - 10, startPoint.y + middleY, endPoint.x - 10, endPoint.y);
        line(endPoint.x - 10, endPoint.y, endPoint.x, endPoint.y);
      } */ 
    }
  }
  