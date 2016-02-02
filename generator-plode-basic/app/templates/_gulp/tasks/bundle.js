var gulp         = require('gulp');
var gutil        = require('gulp-util');
var rename       = require('gulp-rename');
var source       = require('vinyl-source-stream');
var buffer       = require('vinyl-buffer');
var babelify     = require('babelify');
var stringify    = require('stringify');
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
            debug: isDev,
            // transform: [
            //     [babelify, {presets: ['es2015']}],
            //     [stringify, ['.hbs']]
            // ],
            cache: {},
            packageCache: {},
            fullPaths: isDev // true for watchify
        })
        .transform(stringify(['.hbs']))
        .transform(babelify.configure({
            // presets: 'es2015', // babelify >= v7; not playing well with ie 8 - use v6 for now
            sourceMaps: isDev // dependent on debug mode in browserify
        }))
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
        .on('error', function(err) {
            gutil.log(gutil.colors.red('bundle.js: watcher error: err:'), gutil.colors.red(err.message));
            browserSync.notify('Browserify Error!');
            this.emit('end');
        })
        .pipe(source(bundlerConfig.dest + bundlerConfig.name))
        .pipe(buffer())
        .pipe(rename(bundlerConfig.name))
        .pipe(gulp.dest(bundlerConfig.dest))
        .pipe(browserSync.reload({stream: true, once: true}));
}

function setupListeners(bundlerConfig, done) {
    return bundlerConfig.watcher
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
    setupListeners(clientBundler, done);
    bundle(clientBundler);
});

gulp.task('bundle-jasmine', function(done) {
    setupListeners(testBundler, done);
    bundle(testBundler);
});
