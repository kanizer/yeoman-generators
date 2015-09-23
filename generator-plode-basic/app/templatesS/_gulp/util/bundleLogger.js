/*
    bundleLogger
    ------------
    Provides gulp style logs to the bundle method in browserify.js
*/

var gutil        = require('gulp-util');
var prettyHrtime = require('pretty-hrtime');
var startTime;

module.exports = {
    start: function(filepath) {
        startTime = process.hrtime();
        gutil.log('Bundling', gutil.colors.green(filepath) + '...');
    },

    watch: function(bundleName) {
        var names = bundleName instanceof Array ? bundleName : [bundleName];
        names.forEach(function(item) {
            gutil.log('Watching files required by', gutil.colors.yellow(item));
        });
    },

    end: function(filepath) {
        var taskTime = process.hrtime(startTime);
        var prettyTime = prettyHrtime(taskTime);
        gutil.log('Bundled', gutil.colors.green(filepath), 'in', gutil.colors.magenta(prettyTime));
    }
};
