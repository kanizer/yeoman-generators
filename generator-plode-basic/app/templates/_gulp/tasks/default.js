var gulp = require('gulp');

gulp.task('default', [
    'sass',
    'images',
    'bundle',
    'bundle-jasmine',
    'inject',
    'watch',
    'start'
]);

module.exports = gulp;
