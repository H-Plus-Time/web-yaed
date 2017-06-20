# web-yaed

## Build

Requirements:
* emscripten > 1.37
* binaryen
* OpenCV

TLDR: If you have Docker (or can get it quickly), run:
```bash
docker run -v $(pwd):/root/web-yaed -i -t hplustime/alpine-emscripten:wasm-opencv-latest /bin/bash
# In the resulting new shell
cd /root/web-yaed
ln -s /usr/share/emscripten ../emsdk-portable
ln -s /opencv ./opencv
# Skip if dependencies are already installed
yarn
yarn run compile
```

The first two are simple to install (if you happen to be running an x86_64 machine with a ton of RAM) - follow the procedure at [WebAssembly.org](https://webassembly.org/getting-started/developers-guide/), allowing a couple of hours). If you're operating under constrained resources, take a look at [TIL - emscripten](https://github.com/H-Plus-Time/TIL/blob/master/emscripten.md). For ARM systems, definitely read that document - until emsdk correctly identifies architecture rather than just bitness, you're on your own in terms of node.

The third, OpenCV, needs to be separately compiled to llvm archives and moved 
somewhere in the path emscripten uses for linking. The simplest way to do this
is to replicate the logic at [docker-alpine-emscripten/opencv](https://github.com/H-Plus-Time/docker-alpine-emscripten/tree/master/opencv).
Essentially, run the wrapper.sh script (emcmake with a lot of obtuse, poorly understood parameters, followed by emmake) in the root directory of a copy of the opencv source, then copy the include headers for both opencv and opencv2 to their expected locations in the emscripten tree (i.e. <emsdk-root>/system/include/(opencv|opencv2)).

Now, to build, run:
```bash
yarn && yarn run compile
```

and that's it - on typical systems it takes ~35s to compile, and the wasm/js binding pair is ready to go.

For continuous development, run `yarn start` (aliases gulp).

## Usage
See index.html for usage.
