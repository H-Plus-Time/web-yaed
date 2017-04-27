// gulpfile.js
const gulp = require('gulp');
const bs = require('browser-sync').create();
const child = require('child_process');
const exec = require('child_process').exec;

gulp.task('default', ['server', 'recompile', 'browser-sync']);

gulp.task('server', () => {
  let server = child.spawn('node', ['server.js']);
});

gulp.task('recompile', (cb) => {
  exec('npm run compile', (err, stdout, stderr) => {
    if (err) process.stderr.write(err);
    process.stdout.write(stdout);
    cb(err);
    bs.reload();
  });
});

gulp.task('browser-sync', ['recompile'], () => {
  bs.init({
    proxy: 'localhost:3000',
  });
});

gulp.watch('./cpp/**/*.{c,h,cpp,cc,hpp,hh}', ['recompile']);

gulp.watch(['index.js', 'server.js', 'index.html'], () => {
  bs.reload();
});

