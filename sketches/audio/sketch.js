let audio, audioContext, audioData, sourceNode, analyserNode;
let bins = [];
let lineWidths, circles, slices, slice, minLineWidth, startRadius;
let tRotate = 0,
  tColor = 0;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  // strokeCap(SQUARE);

  circles = 5;
  slices = 9;
  slice = TWO_PI / slices;
  lineWidths = [];
  startRadius = 200;
  minLineWidth = 20;

  colorMode(HSL);

  for (let i = 0; i < circles * slices; i++) {
    const bin = random() < 0.5 ? 0 : floor(random(4, 64));
    bins.push(bin);
  }

  for (let i = 0; i < circles; i++) {
    const t = i / (circles - 1);
    const lineWidth = pow(t, 2) * 100 + minLineWidth;
    lineWidths.push(lineWidth);
  }

  addEventListener("mouseup", () => {
    if (!audioContext) createAudio();

    if (audio.paused) {
      audio.play();
      loop();
    } else {
      audio.pause();
      noLoop();
    }
  });
}

function draw() {
  tRotate += TWO_PI / 2000;
  tColor += 0.1;

  const strokeColor = color(tColor % 360, 100, 65);
  strokeColor.setAlpha(0.1);

  background(0);
  background(strokeColor);

  if (!audioContext) return;
  // analyserNode.getFloatFrequencyData(audioData);
  analyserNode.getByteFrequencyData(audioData);

  translate(width * 0.5, height * 0.5);
  noFill();
  strokeWeight(5);

  let radius = startRadius;

  strokeColor.setAlpha(map(audioData[0], 0, 255, 0, 1));
  stroke(strokeColor);

  // noStroke();
  ellipse(0, 0, map(audioData[1], 0, 255, 0, radius * 0.8));
  noFill();

  for (let i = 0; i < circles; i++) {
    push();
    rotate(i % 2 == 0 ? tRotate : -tRotate);

    for (let j = 0; j < slices; j++) {
      rotate(slice);

      const bin = bins[i * slices + j];
      if (!bin) continue;

      const lineWidth = lineWidths[i] * map(audioData[bin], 0, 255, 0, 1);
      if (lineWidth < 1) continue;

      strokeWeight(lineWidth);
      strokeColor.setAlpha(map(audioData[bin], 0, 255, 0.5, 1));
      stroke(strokeColor);

      let size = radius + lineWidths[i];
      arc(0, 0, size, size, 0, slice);
    }

    radius += lineWidths[i] * 2;

    pop();
  }

  // const average = getAverage(audioData);
  // for (let index = 0; index < bins.length; index++) {
  //   const bin = bins[index];
  //   const radius =
  //     map(
  //       audioData[bin],
  //       0, //analyserNode.minDecibels,
  //       255, //analyserNode.maxDecibels,
  //       0,
  //       1
  //     ) * 300;

  //   ellipse(0, 0, radius, radius);
  // }
}

const createAudio = () => {
  audio = document.createElement("audio");
  audio.src = "./song2.mp3";

  audioContext = new AudioContext();
  sourceNode = audioContext.createMediaElementSource(audio);
  sourceNode.connect(audioContext.destination);

  analyserNode = audioContext.createAnalyser();
  analyserNode.fftSize = 512;
  analyserNode.smoothingTimeConstant = 0.9;
  sourceNode.connect(analyserNode);

  //audioData = new Float32Array(analyserNode.frequencyBinCount);
  audioData = new Uint8Array(analyserNode.frequencyBinCount);
};

const getAverage = (data) => {
  const sum = data.reduce((previous, current) => previous + current, 0);
  return sum / data.length;
};
