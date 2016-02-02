/*eslint-disable */
var dest = './src/dest';
var src = './src';
var test = './src/public/tests';
/*eslint-enable */

module.exports = {
    browserSync: {
        static: {
            server: src + '/public/'
        },
        proxy: {
            proxy: 'http://localhost:8080',
            files: ['public/**/*.*'],
            browser: 'google chrome',
            port: 7000
        }
    },
    bundle: {
        client: {
            base: src + '/public/js/src/app.js',
            src: 'app.js',
            name: 'bundle.js',
            dest: src + '/public/js/'
        },
        test: {
            base: test + '/public/app.spec.js',
            src: 'app.spec.js',
            name: 'bundle.spec.js',
            dest: test + '/public/'
        }
    },
    copy: {
        src: src + '/public/index.html',
        srcImg: src + '/public/img/_opt/*.{svg,png,jpg,gif,ico}',
        srcFont: src + '/public/css/fonts/*.{eot,ttf,woff,woff2,svg}',
        dest: dest,
        destImg: dest + '/img',
        destFont: dest + '/css/fonts'
    },
    images: {
        src: src + '/public/img/**.{jpg,png,gif}',
        dest: src + '/public/img/_opt/'
    },
    inject: {
        target: src + '/public/index_temp.html',
        dev: src + '/public',
        prod: dest,
        paths: [
            src + '/public/css/webfont.css',
            src + '/public/css/main.css',
            src + '/public/js/bundle.js'
        ],
        rename: 'index.html'
    },
    jasmine: {
        src: 'tests/public/bundle.spec.js'
    },
    lint: {
        src: [src + '/public/js/**/*.js', '!' + src + '/public/js/bundle.js'],
        conf: src + '/public/js/.eslintrc' // this prop is optional - defaults to the same conf in this case
    },
    markup: {
        src: src + '/public/*.html',
        dest: dest
    },
    nodemon: {
        script: 'src/app.js',
        env: { 'NODE_ENV': 'dev' },
        watch: [
            'src/app.js',
            'src/server',
            'src/utils'
        ],
        ignore: [
            'src/public/js/**/*.js'
        ],
        port: 8080 // NOTE: be sure to match this to defined port in server/app.js
    },
    production: {
        cssHtml: src + '/public/index.html',
        cssSrc: [
            src + '/public/css/main.css'
        ],
        bundleSrc: src + '/public/js/bundle.js',
        jsSrc: src + '/public/js/*.js',
        cssDest: dest + '/css',
        jsDest: dest + '/js'
    },
    sass: {
        src: src + '/public/css/sass/**/*.{sass,scss}',
        dest: src + '/public/css/'
    }
};
