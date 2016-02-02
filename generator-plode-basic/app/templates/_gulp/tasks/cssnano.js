var gulp      = require('gulp');
var cssnano   = require('gulp-cssnano');
var size      = require('gulp-filesize');
var config    = require('../config').production;

gulp.task('cssnano', function() {
    return gulp.src(config.cssSrc)
        .pipe(cssnano({
            keepBreaks: true,
            discardUnused: {
                fontFace: false
            }
        }))
        .pipe(gulp.dest(config.cssDest))
        .pipe(size());
});
