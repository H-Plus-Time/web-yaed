// wasm.config.js
module.exports = {
  emscripten_path: './../emsdk-portable',
  inputfile: './cpp/*.cpp',
  outputfile: './web-yaed.js',
  exported_functions: [
    '_detect',
  ],
  flags: [
    '-std=c++11',
    '-O3',
    '--bind',
    '-s DEMANGLE_SUPPORT=1',
    '-s WASM=1',
    '-s MODULARIZE=1',
    '-s EXPORT_NAME=\"\'webYaed\'\"',
    '-s ASSERTIONS=2',
    '-s ALLOW_MEMORY_GROWTH=1',
    './opencv/build/lib/libopencv_imgproc.a',
    './opencv/build/lib/libopencv_core.a',
    './opencv/build/3rdparty/lib/libzlib.a',
  ],
};
