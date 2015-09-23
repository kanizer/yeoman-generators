var gulp    = require('gulp');
var changed = require('gulp-changed');
var merge   = require('merge-stream');
var config  = require('../config').copy;

gulp.task('copy', function(done) {
    var ind = gulp.src(config.src)
        .pipe(changed(config.dest))
        .pipe(gulp.dest(config.dest));
    var img = gulp.src(config.srcImg)
        .pipe(changed(config.destImg))
        .pipe(gulp.dest(config.destImg));
    var font = gulp.src(config.srcFont)
        .pipe(changed(config.destFont))
        .pipe(gulp.dest(config.destFont));

    return merge(ind, img, font);
});
