var gulp        = require('gulp');
var gutil       = require('gulp-util');
var runSequence = require('run-sequence');

// Run this to compress all the things!
gulp.task('production', ['bundle', 'jasmine'], function(done) {
    // This runs only if the jasmine tests pass
    runSequence('lint', ['images', 'cssnano', 'build', 'copy'], 'alert', function() {
    	gutil.log(gutil.colors.green('>>>> Deployment Successful! Rejoice!'));
    	gutil.beep();
    	done();
    });
});
