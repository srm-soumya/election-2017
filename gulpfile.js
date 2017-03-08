var gulp = require('gulp')
var babel = require('gulp-babel')
var uglify = require('gulp-uglify')
var concat = require('gulp-concat')
var rename = require('gulp-rename')

gulp.task('compress', function() {
  return gulp.src('static/lib/*.js')
    .pipe(babel({presets: ['es2015']}))
    .pipe(concat('bundle.js'))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('static/dist/js/'))
});
