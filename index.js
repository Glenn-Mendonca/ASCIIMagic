// let wasm = WebAssembly.Module.cwrap("convertToASCII", "string", [
//   "Uint8ClampedArray",
//   "number",
//   "number",
//   "boolean",
// ]);

let [width, height] = [320, 0];

const button = document.getElementById("but");
const video = document.getElementById("vid");
const canvas = document.createElement("canvas");
video.muted = true;

button.addEventListener("click", takepicture);

let mapper = "Ñ@#W$9876543210?!abc;:+=-,._ ";
// let mapper = "@#＄%?*+;:,. ";

navigator.mediaDevices
  .getUserMedia({ video: true })
  .then((stream) => {
    height = video.videoHeight / (video.videoWidth / width);
    if (isNaN(height)) height = width / (4 / 3);
    video.setAttribute("width", width);
    video.setAttribute("height", height);
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);
    video.srcObject = stream;
    setInterval(() => takepicture("test1"), 1000 / 60);
    // setInterval(() => takepicture("test2"), 1000 / 1);
    video.addEventListener("loadedmetadata", () => {
      video.play();
    });
  })
  .catch(alert);

function takepicture() {
  let frame = "test1";
  const context = canvas.getContext("2d");
  let scale = 1;
  if (width && height) {
    width = 192 * scale;
    height = 108 * scale;
    canvas.width = width;
    canvas.height = height;
    context.drawImage(video, 0, 0, width, height);
    let image = context.getImageData(0, 0, width, height)?.data;
    // console.log(wasm(image, height, width, false));
    let buffer = new Uint8ClampedArray(width * height * 4);
    let string = "";
    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        var pos = (y * width + x) * 4; // position in buffer based on x and y
        let avg = (image[pos] + image[pos + 1] + image[pos + 2]) / 3;
        buffer[pos] = image[pos]; // some R value [0, 255]
        buffer[pos + 1] = image[pos + 1]; // some G value
        buffer[pos + 2] = image[pos + 2]; // some B value
        buffer[pos + 3] = image[pos + 3]; //avg // set alpha channel
        string += mapper[Math.floor((avg / 256) * mapper.length)];
      }
      string += "\n";
    }
    document.getElementById("ascii").innerHTML = string;
    let idata = context.createImageData(width, height);
    idata.data.set(buffer);
    context.putImageData(idata, 0, 0);
    let dataUri = canvas.toDataURL();
    // document.getElementById(frame).src = dataUri;
    // console.log(
    //   context.getImageData(0, 0, width, height),
    //   width,
    //   height,
    //   context.getImageData(0, 0, width, height).data[0]
    // );
    // document.getElementById(frame).src = data;
    // console.log(data);
  } else {
    console.log("err");
  }
}

fetch("./main.wasm")
  .then((bytes) => bytes.arrayBuffer())
  .then((res) => WebAssembly.Module(res));
