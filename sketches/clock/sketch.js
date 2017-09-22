 let offsetSecond = 0;
 let offsetMinute = 0;
 let offsetHour = 0;

 function setup() {
   createCanvas(windowWidth, windowHeight);
   angleMode(DEGREES);

   offsetSecond = second();
   offsetMinute = minute();
   offsetHour = hour();
 }

 function windowResized() {
   resizeCanvas(windowWidth, windowHeight);
 }

 function draw() {
   background(0);

   let scColor = color(255, 20, 82);
   let mnColor = color(20, 247, 255);
   let hrColor = color(17, 255, 120);

   let ms = millis();
   var sc = offsetSecond + ms/1000;
   var mn = offsetMinute + sc/60;
   var hr = offsetHour + mn/60;

   sc = sc % 60;
   mn = mn % 60;
   hr = hr % 24;

   fill(255);
   noStroke();
//   text("Milliseconds since program start " + ms, 10, 50);
//   text("Seconds " + sc, 10, 100);
//   text("Minutes " + mn, 10, 150);
//   text("Hours " + hr, 10, 200);

   translate(width * 0.5, height * 0.5);
   rotate(-90);

   let strokeSize = 10;
   let scSize = height* 0.6;
   let mnSize = scSize - strokeSize * 4;
   let hrSize = mnSize - strokeSize * 4;
   let pointerSize = hrSize * 0.3;

   strokeWeight(10);
   stroke(scColor);
   noFill();
   let secondAngle = map(sc, 0, 60, 0, 360);
   arc(0, 0, scSize, scSize, 0, secondAngle);

   stroke(mnColor);
   let minuteAngle = map(mn, 0, 60, 0, 360);
   arc(0, 0, mnSize, mnSize, 0, minuteAngle);

   stroke(hrColor);
   let hourAngle = map(hr, 0, 12, 0, 360);
   arc(0, 0, hrSize, hrSize, 0, hourAngle);

   // POINTERS

   push();
   rotate(secondAngle);
   stroke(scColor);
   line(0, 0, pointerSize, 0);
   pop();

   push();
   rotate(minuteAngle);
   stroke(mnColor);
   line(0, 0, pointerSize * 0.75, 0);
   pop();

   push();
   rotate(hourAngle);
   stroke(hrColor);
   line(0, 0, pointerSize * 0.50, 0);
   pop();

   strokeWeight(20);
   stroke(255);
   point(0, 0);

   // HOUR MARKERS
   stroke(255);
   strokeWeight(1);
   var rot = 0;
   for (var i = 0; i < 12; i++) {
     push();
     rotate(rot);
     translate(scSize * 0.55, 0);
     line(0, 0, pointerSize * 0.5, 0);
     pop();
     rot += 360/12;
   }
 }
