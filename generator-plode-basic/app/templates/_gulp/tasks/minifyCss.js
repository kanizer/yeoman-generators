var gulp      = require('gulp');
var minifyCSS = require('gulp-minify-css');
var size      = require('gulp-filesize');
var config    = require('../config').production;

gulp.task('minifyCss', function() {
    return gulp.src(config.cssSrc)
        .pipe(minifyCSS({keepBreaks: true}))
        .pipe(gulp.dest(config.cssDest))
        .pipe(size());
});
