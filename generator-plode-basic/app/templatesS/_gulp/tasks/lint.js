var gulp = require('gulp');
var cache = require('gulp-cached');
var eslint = require('gulp-eslint');
var config = require('../config').lint;
var argv = require('yargs').argv;

gulp.task('lint', function () {
    var lint = gulp.src(config.src)
        .pipe(cache('linting'))
        .pipe(eslint())
        .pipe(eslint.format());

    // if (argv.ci) {
    //     lint = lint.pipe(eslint.failAfterError());
    // }

    return lint;
});
