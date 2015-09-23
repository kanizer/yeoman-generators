var gulp    = require('gulp');
var gutil   = require('gulp-util');
var nodemon = require('gulp-nodemon');
var config  = require('../config').nodemon;

gulp.task('nodemon', function (cb) {
    var started = false;
    return nodemon(config)
        .on('start', function() {
            if (!started) {
                gutil.log(gutil.colors.blue('gulp nodemon: restarted'));
                started = true;
                cb();
            }
        })
        .on('restart', function() {
            gutil.log(gutil.colors.blue('gulp nodemon: restarted'));
        })
        .on('stop', function() {
            gutil.log(gutil.colors.blue('gulp nodemon: stopped'));
        });
});
