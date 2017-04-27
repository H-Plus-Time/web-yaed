# web-yaed

## Build

Requirements:
* emscripten > 1.37
* binaryen
* OpenCV

The first two are simple to install (if you happen to be running an x86_64 machine with a ton of RAM) - follow the procedure at [WebAssembly.org](https://webassembly.org/getting-started/developers-guide/), allowing a couple of hours). If you're operating under constrained resources, take a look at [TIL - emscripten](https://github.com/H-Plus-Time/TIL/blob/master/emscripten.md). For ARM systems, definitely read that document - until emsdk correctly identifies architecture rather than just bitness, you're on your own in terms of node.

The third, OpenCV, needs to be separately compiled to llvm archives. Run:
```bash
git clone github.com/ucisysarch/opencvjs.git
cd opencvjs
git clone github.com/opencv/opencv.git
python make.py
```

Either create a symlink in this directory pointing to the above, or perform the above in this directory.

Note that we don't actually care about the js bindings provided by opencvjs, just the .a files in opencvjs/opencv/build/lib - the build will most likely fail, but not before the archive files are generated.

Now, to build, run:
```bash
yarn && yarn run compile
```

and that's it - on typical systems it takes ~35s to compile, and the wasm/js binding pair is ready to go.

For continuous development, run `yarn start` (aliases gulp).

## Usage
Currently the instantiation procedure is a little involved for wasm modules, so the creators of wasm-init helpfully provide the standard loadWASM.js boilerplate - include it first, then call loadWASM in the same manner as in index.js.