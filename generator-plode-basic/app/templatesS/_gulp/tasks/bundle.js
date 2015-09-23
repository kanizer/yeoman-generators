var gulp         = require('gulp');
var gutil        = require('gulp-util');
var rename       = require('gulp-rename');
var source       = require('vinyl-source-stream');
var buffer       = require('vinyl-buffer');
var babelify     = require('babelify');
var watchify     = require('watchify');
var browserify   = require('browserify');
var browserSync  = require('browser-sync');
var nconf        = require('nconf');
var bundleLogger = require('../util/bundleLogger');
var config       = require('../config').bundle;

nconf
  .env()
  .argv();

var isDev = nconf.get('NODE_ENV') === 'dev';

function setupBundler(basePath) {
    var watcher = watchify(
        browserify({
            entries: basePath.base,
            transform: [babelify],
            cache: {},
            packageCache: {},
            fullPaths: isDev // true for watchify
        })
    );

    return {
        watcher: watcher,
        name: basePath.name,
        src: basePath.dest + basePath.name,
        dest: basePath.dest
    };
}

function bundle(bundlerConfig) {
    bundleLogger.start(bundlerConfig.name);

    bundlerConfig.watcher.bundle()
        .pipe(source(bundlerConfig.dest + bundlerConfig.name))
        .pipe(buffer())
        .pipe(rename(bundlerConfig.name))
        .pipe(gulp.dest(bundlerConfig.dest))
        .pipe(browserSync.reload({stream: true, once: true}));
}

function setupListeners(bundlerConfig, done) {
    return bundlerConfig.watcher
        .on('error', function(err) {
            gutil.log(gutil.colors.red('bundle.js: watcher error: err:'), gutil.colors.red(err.message));
            browserSync.notify('Browserify Error!');
            this.emit('end');
        })
        .on('time', function(time) {
            bundleLogger.end(bundlerConfig.name);
            if(!isDev) {
                done();
            }
        })
        .on('update', function(ids) {
            // gutil.log('bundle.js: update: ids:', ids);
            bundle(bundlerConfig);
        });
}

// create bundlers
var clientBundler = setupBundler(config.client);
var testBundler = setupBundler(config.test);

// On updates recompile
bundleLogger.watch([config.client.name, config.test.name]);

gulp.task('bundle', function(done) {
    bundle(clientBundler);
    setupListeners(clientBundler, done);
});

gulp.task('bundle-jasmine', function(done) {
    bundle(testBundler);
    setupListeners(testBundler, done);
});
