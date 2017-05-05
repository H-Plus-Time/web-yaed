// index.js
let m = {}

function test(ctx) {
  width = ctx.canvas.width;
  height = ctx.canvas.height;
  pixelData = ctx.getImageData(0,0,width, height).data;
  const len = pixelData.length;
  const mem = webYaed._malloc(len);
  webYaed.HEAPU8.set(pixelData, mem);
  vec_ptr = webYaed._detect(mem, width, height);
  const filtered = webYaed.HEAPU8.subarray(mem, mem + len);
  webYaed._free(mem);
  ellipses = new webYaed.VectorEllipse(vec_ptr);
  return ellipses;
}

function test_harness(preliminary) {
  // parameter space given by [R, d^QR, d, theta^x]
  resolutions = [
    {x: 480, y: 640}, {x: 720, y: 1280}, {x: 1080, y: 1920},{x: 1440, y: 2560},
    {x: 2160, y: 3840}
  ];
  qr_diameters = [20];
  distances = [1,2,4,6,8,10, 12, 14, 16, 18];
  thetas = [-30, -20, -10, -5, 0, 5, 10, 20, 30];
  if(preliminary) {
    resolutions = resolutions.slice(1);
    qr_diameters = qr_diameters.slice(0, 1);
    distances = distances.slice(0, 5);
    thetas = thetas.slice(3,5);
  }
  detected_ellipses_container = {};
  for(r in resolutions) {
    for(diam in qr_diameters) {
      for(dist in distances) {
        for(theta in thetas) {
          path = `/test/${r.x}_${r.y}_${diam}_${dist}_${theta}`;
          img = new Image();
          img.addEventListener('load', function() {
            cvs = document.createElement('canvas');
            cvs.width = r.x;
            cvs.height = r.y;
            ctx = cvs.getContext('2d');
            ctx.drawImage(img, 0, 0);
            detected_ellipses = test(ctx);
            detected_ellipses_container[path] = detected_ellipses;
            delete cvs;
            delete img;
          });
          img.src = path;
        }
      }
    }
  }
  for(k in detected_ellipses_container) {
    detected_ellipses_container[k].delete();
  }
}


loadWASM().then(wasmModule => {
  singleEllipse = document.getElementById('single-ellipse');
  ctx = singleEllipse.getContext('2d');
  width = singleEllipse.getAttribute('width');
  height = singleEllipse.getAttribute('height');
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0,0,width,height);
  ctx.fillStyle = "#000000";
  ctx.imageSmoothingEnabled = false;
  ctx.stroke();
  ctx.beginPath();
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 1;
  ctx.ellipse(60.5, 50.5, 40.5, 30.5, 45 * Math.PI/180, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 1;
  ctx.ellipse(100.5, 150.5, 40, 40, 45 * Math.PI/180, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 1;
  ctx.ellipse(200.5, 75.5, 10.5, 5.5, 45 * Math.PI/180, 0, 2 * Math.PI);
  ctx.stroke();

  test(ctx);
});
