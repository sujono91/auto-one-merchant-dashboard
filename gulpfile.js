const gulp = require('gulp');
const gzip = require('gulp-gzip');

gulp.task('compress', function() {
  gulp
    .src(['./build/static/**/*.*'])
    .pipe(gzip())
    .pipe(gulp.dest('./build/static'));
});
