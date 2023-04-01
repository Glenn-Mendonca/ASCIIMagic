const fs = require("fs");
fs.readFile(
  "./main.wasm",
  ((err) => console.error(err), (data) => console.log("data", data))
);
// const wasm = require("./main.wasm");
// bytes = wasm.arrayBuffer();
// mod = new WebAssembly.Module(mod).imports();
// console.log(mod);
