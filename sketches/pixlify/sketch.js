const settings = {
  pixelSize: 16,
  img: undefined,
  fileName: "",
};

let pane = new Tweakpane.Pane();

function setup() {
  if (typeof window.showOpenFilePicker !== "function") {
    return;
  }

  createCanvas(window.innerWidth, window.innerHeight);

  pane = new Tweakpane.Pane();
  pane
    .addInput(settings, "pixelSize", {
      min: 5,
      max: 30,
      step: 1,
      label: "Pixelsize",
    })
    .on("change", (ev) => {
      if (ev.last && settings.img) {
        paintImage();
      }
    });
  pane.addMonitor(settings, "fileName", {
    label: "",
    disabled: true,
  });
  pane
    .addButton({
      label: "Image",
      title: "Select",
    })
    .on("click", () => selectImage());
}

async function selectImage() {
  const filePickerOptions = {
    types: [
      {
        description: "Images",
        accept: {
          "image/*": [".png", ".gif", ".jpeg", ".jpg"],
        },
      },
    ],
    excludeAcceptAllOption: true,
    multiple: false,
  };

  const [fileHandle] = await window.showOpenFilePicker(filePickerOptions);
  const file = await fileHandle.getFile();
  const fileReader = new FileReader();

  settings.fileName = file.name;
  pane.refresh();

  fileReader.addEventListener("loadend", () => {
    createImg(fileReader.result, (img) => {
      settings.img = img;
      paintImage();
    }).hide();
  });

  fileReader.readAsDataURL(file);
}

function paintImage() {
  pane.disabled = true;

  const img = settings.img;
  background(255);

  const gp = createGraphics(width, height);
  gp.image(img, 0, 0, width, height);
  gp.loadPixels();

  noStroke();
  const density = pixelDensity();

  const dots = min(
    gp.pixels.length / 4 / settings.pixelSize,
    (1920 * 1080) / settings.pixelSize
  );
  for (let i = 0; i < dots; i++) {
    const x = int(random(gp.width));
    const y = int(random(gp.height));
    const index = 4 * (y * density * width * density + x * density);

    const fillColor = [
      gp.pixels[index + 0],
      gp.pixels[index + 1],
      gp.pixels[index + 2],
      gp.pixels[index + 3],
    ];
    fill(fillColor);
    ellipse(x, y, settings.pixelSize, settings.pixelSize);
  }

  pane.disabled = false;
}
