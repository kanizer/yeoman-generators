var gulp   = require('gulp');
var config = require('../config');

gulp.task('watch', function() {
    gulp.watch(config.sass.src, ['sass']);
    gulp.watch(config.images.src, ['images']);
    gulp.watch(config.inject.target, ['inject']);
    gulp.watch(config.jasmine.src, ['jasmine']);
});
