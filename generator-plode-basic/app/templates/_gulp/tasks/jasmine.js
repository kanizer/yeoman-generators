var gulp        = require('gulp');
var gutil       = require('gulp-util');
var jasmine     = require('gulp-jasmine');
var shell       = require('gulp-shell');
var runSequence = require('run-sequence');
var net         = require('net');
var Promise     = require('bluebird');
var conf        = require('../config');
var confJasmine = conf.jasmine;

function isPortTaken(port) {
    return new Promise(function(resolve, reject) {
        var tester = net.createServer()
            .once('error', function(err) {
                if(err.code === 'EADDRINUSE') {
                    reject(err);
                }
            })
            .once('listening', function() {
                tester
                    .once('close', function() {
                        resolve(true);
                    })
                    .close();
            })
            .listen(port);
    });
}

gulp.task('jasmine', function(done) {
    gulp.src(confJasmine.src)
        .pipe(jasmine({
            verbose: true,
            includeStackTrace: true
        }))
        .on('error', function(err) {
            gutil.log(gutil.colors.red('jasmine.js: error:'), gutil.colors.red(err.message));
            /*eslint-disable */
            process.exit(0);
            /*eslint-enable */
        })
        .on('finish', function() {
            gutil.log(gutil.colors.blue('jasmine.js: done'));
            done();
        });
});

gulp.task('test-alias', function(done) {
    gulp.src('', {read: false})
        .pipe(shell(['open -a "Google Chrome" "http://localhost:' + conf.nodemon.port + '/tests"']))
        .on('finish', function() {
            gutil.log(gutil.colors.blue('jasmine.js: test: done'));
            done();
            /*eslint-disable */
            process.exit(0);
            /*eslint-enable */
        });
});

gulp.task('test', function() {
    return isPortTaken(conf.nodemon.port)
        .then(function() {
            runSequence(['nodemon', 'test-alias']);
        })
        .catch(function() {
            runSequence(['test-alias']);
        });
});
