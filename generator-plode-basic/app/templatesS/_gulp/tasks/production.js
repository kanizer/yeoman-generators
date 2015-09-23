var gulp        = require('gulp');
var runSequence = require('run-sequence');

// Run this to compress all the things!
gulp.task('production', ['bundle', 'jasmine'], function(done) {
    // This runs only if the jasmine tests pass
    runSequence('lint', ['images', 'minifyCss', 'build', 'copy'], 'alert');
});
