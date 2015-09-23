var gulp       = require('gulp');
var uglify     = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var buffer     = require('vinyl-buffer');
var config     = require('../config').production;

/**
 * uglify and generate sourcemaps
 */
gulp.task('build', function (done) {
    return gulp.src(config.bundleSrc)
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
        .pipe(uglify())
        .pipe(sourcemaps.write('./')) // writes .map file
        .pipe(gulp.dest(config.jsDest));
});
