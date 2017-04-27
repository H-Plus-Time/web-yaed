// wasm.config.js
module.exports = {
  emscripten_path: './../emsdk-portable',
  inputfile: './cpp/*.cpp',
  outputfile: './wasm/web-yaed.js',
  exported_functions: [
    '_detect',
  ],
  flags: [
    '-std=c++11',
    '-s WASM=1',
    '-s ASSERTIONS=2',
    '-O3',
    '--bind',
    '-s ALLOW_MEMORY_GROWTH=1',
    '-s DEMANGLE_SUPPORT=1',
    './opencvjs/opencv/build/lib/libopencv_core.a',
    './opencvjs/opencv/build/lib/libopencv_imgcodecs.a',
    './opencvjs/opencv/build/lib/libopencv_imgproc.a',
    './opencvjs/opencv/build/lib/libopencv_features2d.a',
  ],
};

