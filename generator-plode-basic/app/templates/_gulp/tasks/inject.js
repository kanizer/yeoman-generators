var gulp        = require('gulp');
var inject      = require('gulp-inject');
var rename      = require('gulp-rename');
var browserSync = require('browser-sync');
var config      = require('../config').inject;

var dest = (process.env.NODE_ENV === 'prod') ? config.prod : config.dev;

gulp.task('inject', function() {
    var template = gulp.src(config.paths, {read: false});
    return gulp.src(config.target)
        .pipe(inject(template, {relative: true}))
        .pipe(rename(config.rename))
        .pipe(gulp.dest(dest))
        .pipe(browserSync.reload({stream: true}));
});
