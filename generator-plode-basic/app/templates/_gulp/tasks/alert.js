var gulp  = require('gulp');
var shell = require('gulp-shell');

gulp.task('alert', function(done) {
    gulp.src('', {read: false})
        .pipe(shell(['say "it put\'s the lotion in the basket" -v Albert;']))
        .on('finish', function() {
            done();
            /*eslint-disable */
            process.exit(0);
            /*eslint-enable */
        });
});
