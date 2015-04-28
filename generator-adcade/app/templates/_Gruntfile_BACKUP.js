// Generated on 2014-03-11 using generator-webapp 0.4.8
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        config: {
            // Configurable paths
            app: '[DIR_ROOT]',// '../../../../../../../', // sites folder / localhost / adcade.dev
            deploy: '[DIR_PROJECT]/deploy',
            dist: '[DIR_PROJECT]/dev'// 'ads/staging/internal/ns_sandbox/2013/ns/yeoman_adcade'
        },

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            bower: {
                files: ['bower.json'],
                tasks: ['bowerInstall']
            },

            gruntfile: {
                files: ['Gruntfile.js']
            },

            // using browserSync instead
            // livereload: {
            //     options: {
            //         livereload: '<%= connect.options.livereload %>'
            //     },
            //     files: [
            //         '<%= config.app %>/<%= config.dist %>/*.html',
            //         '<%= config.app %>/<%= config.dist %>/assets/css/*.css',
            //         '<%= config.app %>/<%= config.dist %>/assets/img/*',
            //         '<%= config.app %>/<%= config.dist %>/assets/js/**/*.js'
            //     ]
            // },

            js: {
                files: ['<%= config.app %>/<%= config.dist %>/assets/js/**/*.js'],
                tasks: ['todos']
            }
        },

        browserSync: {
            dev: {
                bsFiles: {
                    src: [
                        '<%= config.app %>/<%= config.dist %>/assets/js/**/*.js}',
                        '<%= config.app %>/<%= config.dist %>/assets/img/**/*.{gif,jpeg,jpg,png}',
                        '<%= config.app %>/<%= config.dist %>/*.html'
                    ]
                },
                options: {
                    watchTask: true,
                    debugInfo: true,

                    // host: '10.0.1.9',
                    
                    // update all browser instances (defaults to true)
                    // ghostMode: {
                    //     clicks: true,
                    //     scroll: true,
                    //     links: true,
                    //     forms: true
                    // },
                    
                    // static file server
                    // server: {
                        // baseDir: 'app',
                        // index: 'index.html'
                    // },

                    // local server proxy
                    // proxy: {
                    //     host: 'adcade.dev',
                    //     // optional port designation
                    //     // port: 8001
                    // }
                }
            }
        },

        // using BrowserSync instead
        // The actual grunt server settings
        // connect: {
        //     options: {
        //         port: 9000,
        //         livereload: 35729,
        //         base: '<%= config.app %>',
        //         open: 'http://adcade.dev:9000/<%= config.dist %>/index.html', // TODO - WHY CAN'T I USE CONFIG.APP HERE?

        //         // Change this to '0.0.0.0' to access the server from outside
        //         hostname: '*'
        //     },
        //     livereload: {
        //         options: {
        //             base: '<%= config.app %>'
        //         }
        //     },
        //     dist: {
        //         options: {
        //             open: true,
        //             base: '<%= config.dist %>',
        //             livereload: false
        //         }
        //     }
        // },

        // Automatically inject Bower components into the HTML file
        bowerInstall: {
            app: {
                src: ['<%= config.app %>/index.html'],
                ignorePath: '<%= config.app %>/'
            }
        },

        // The following *-min tasks produce minified files in the dist folder
        imageoptim: {
            options: {
                quitAfter: true
            },
            myPngs: {
                options: {
                    jpegMini: false, // pending purchase of pro version
                    imageAlpha: true,
                    quitAfter: true
                },
                src: [
                    '<%= config.app %>/<%= config.deploy %>/**/assets/img/'
                ]
            },
            // myJpgs: {
            //   options: {
            //     jpegMini: true,
            //     imageAlpha: false,
            //     // quitAfter: true
            //   },
            //   src: fullDirectories
            // }
        },

        // imagemin: {
        //     dynamic: {
        //         options: {
        //             optimizationLevel: 3
        //         },
        //         files: [{
        //             expand: true,
        //             cwd: '<%= config.app %>/<%= config.dist %>/assets/img/',
        //             src: '*.{gif,jpeg,jpg,png}',
        //             dest: '<%= config.app %>/<%= config.dist %>/assets/img/optimized'
        //         }]
        //     }
        // },

        // // grunt-image - errors on installation
        // image: {
        //     // static: {
        //     //     files: { 
        //     //         'dist/img.png': 'src/img.png',
        //     //         'dist/img.jpg': 'src/img.jpg',
        //     //         'dist/img.gif': 'src/img.gif'
        //     //     }
        //     // },
        //     dynamic: {
        //         files: [{
        //             expand: true,
        //             cwd: '<%= config.app %>/<%= config.dist %>/assets/img/',
        //             src: '*.{gif,jpeg,jpg,png}',
        //             dest: '<%= config.app %>/<%= config.dist %>/assets/img/optimized'
        //         }]
        //     }
        // },

        todos: {
            // options: {
            //     verbose: false,
            //     priorities: {
            //         low: null,
            //         med: /(TODO|FIXME)/
            //     }
            // },
            // todos: ['/<%= config.app %>/<%= config.dist %>/assets/js/**/*.js'],
            // todos: '../dev/todos.txt' // how to set dir?
            
            console_verbose_false : {
                options : {
                    verbose : false
                },
                src : ['<%= config.app %>/<%= config.dist %>/assets/js/**/*.js']
            },

            custom_reporter : {
                options : {
                    verbose: false,
                    reporter : {
                        // header : function () { return '--header--\n'; },
                        // footer : function () { return '--footer--\n'; },
                        fileTasks : function (file, tasks, options) {
                            var rootPath = grunt.config.get('config');
                            rootPath = rootPath.app + rootPath.dist + '/assets/js/';
                            var result = '\n' + file.replace(rootPath, '') + '\n';

                            if(tasks.length === 0) result = '\n';
                            tasks.forEach(function (task) {
                                if(task.line.split('*').length > 1)
                                {
                                    task.line = task.line.split('*')[1];
                                }
                                if(task.line.split('//').length > 1)
                                {
                                    task.line = task.line.split('//')[1];
                                }
                                result += 'line: ' + task.lineNumber + ', ' + task.priority + ': ' + task.line + '\n';
                            });
                            return result;
                        }
                    },
                },
                files: {
                    'todos' : ['<%= config.app %>/<%= config.dist %>/assets/js/**/*.js']
                }
            }
        },

        copy: {
            stage: {
                files: [
                    // includes files within path
                    {
                        expand: true,
                        cwd: '<%= config.app %>/<%= config.dist %>/assets/js/',
                        src: 'main-built.js',
                        dest: '../deploy/stage/assets/js/',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        cwd: '<%= config.app %>/<%= config.dist %>/assets/img/',
                        src: '*.{gif,jpeg,jpg,png}',
                        dest: '../deploy/stage/assets/img/',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        cwd: '<%= config.app %>/<%= config.dist %>/assets/vid/',
                        src: '*.{mp4,webm}',
                        dest: '../deploy/stage/assets/vid/',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        cwd: '<%= config.app %>/<%= config.dist %>/assets/css/',
                        src: '*.{css}',
                        dest: '../deploy/stage/assets/css/',
                        filter: 'isFile'
                    }
                ]
            },
            prod: {
                files: [
                    // includes files within path
                    {
                        expand: true,
                        cwd: '<%= config.app %>/<%= config.dist %>/assets/js/',
                        src: 'main-built.js',
                        dest: '../deploy/prod/',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        cwd: '<%= config.app %>/<%= config.dist %>/assets/img/',
                        src: '*.{gif,jpeg,jpg,png}',
                        dest: '../deploy/prod/assets/img/',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        cwd: '<%= config.app %>/<%= config.dist %>/assets/vid/',
                        src: '*.{mp4,webm}',
                        dest: '../deploy/prod/assets/vid/',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        cwd: '<%= config.app %>/<%= config.dist %>/assets/css/',
                        src: '*.{css}',
                        dest: '../deploy/prod/assets/css/',
                        filter: 'isFile'
                    }
                ]
            }
        },

        // Standard ftp protocol
        'ftp-deploy': {
            build: {
                auth: {
                    host: 'plode.com',
                    port: 21,
                    authKey: 'key1'
                },
                src: '<%= config.app %><%= config.dist %>/assets',
                dest: '/testserv',
                exclusions: [
                    '<%= config.app %><%= config.dist %>/assets/**/*.DS_Store'
                ]
            }
        },



        // configured to use local rsa key
        'sftp-deploy': {
            build: {
                auth: {
                    host: 'adcade.com',
                    port: 22,
                    // point to key - defaults to rsa key
                    authKey: 'privateKeyCustom'
                },

                // config per project
                src: '<%= config.app %><%= config.deploy %>/stage',
                dest: '<%= config.stageFtpRoot %><%= config.stage %>/stage',
                exclusions: [
                    '<%= config.app %><%= config.deploy %>/stage/assets/img/**/.DS_Store',
                    '<%= config.app %><%= config.deploy %>/stage/assets/img/**/Thumbs.db'
                ],
                // server_sep: '/'
            }
        },



        // https://github.com/MathieuLoutre/grunt-aws-s3
        aws: grunt.file.readJSON('aws-keys.json'),

        aws_s3: {
            options: {
                accessKeyId: '<%= aws.AWSAccessKeyId %>', // Use the variables
                secretAccessKey: '<%= aws.AWSSecretKey %>', // You can also use env variables
                // region: 'eu-west-1',
                uploadConcurrency: 5, // 5 simultaneous uploads
                downloadConcurrency: 5 // 5 simultaneous downloads
            },
            // staging: {
            //     options: {
            //         bucket: 'my-wonderful-staging-bucket',
            //         differential: true // Only uploads the files that have changed
            //     },
            //     files: [
            //         {
            //             dest: 'app/',
            //             cwd: 'backup/staging/',
            //             action: 'download'
            //         },
            //         {
            //             expand: true,
            //             cwd: 'dist/staging/scripts/',
            //             src: ['**'],
            //             dest: 'app/scripts/'
            //         },
            //         {
            //             expand: true,
            //             cwd: 'dist/staging/styles/',
            //             src: ['**'],
            //             dest: 'app/styles/'
            //         },
            //         {
            //             dest: 'src/app',
            //             action: 'delete'
            //         },
            //     ]
            // },
            production: {
                options: {
                    bucket: 'my-wonderful-production-bucket',
                    params: {
                        ContentEncoding: 'gzip' // applies to all the files!
                    },
                    mime: {
                        'dist/assets/production/LICENCE': 'text/plain'
                    }
                },
                files: [
                    {
                        expand: true,
                        cwd: 'dist/production/',
                        src: ['**'],
                        dest: 'app/'
                            },
                    {
                        expand: true,
                        cwd: 'assets/prod/large',
                        src: ['**'],
                        dest: 'assets/large/',
                        stream: true
                            }, // enable stream to allow large files
                    {
                        expand: true,
                        cwd: 'assets/prod/',
                        src: ['**'],
                        dest: 'assets/',
                        params: {
                            // CacheControl only applied to the assets folder
                            // LICENCE inside that folder will have ContentType equal to 'text/plain'
                            CacheControl: '2000'
                        }
                    },
                ],
                clean_production: {
                    options: {
                        bucket: 'my-wonderful-production-bucket',
                        debug: true // Doesn't actually delete but shows log
                    },
                    files: [
                        {
                            dest: 'app/',
                            action: 'delete'
                        },
                        {
                            dest: 'assets/',
                            exclude: "**/*.tgz",
                            // will not delete the tgz
                            action: 'delete'
                        },
                        {
                            dest: 'assets/large/',
                            exclude: "**/*copy*",
                            flipExclude: true,
                            // will delete everything that has copy in the name
                            action: 'delete'
                        }
                    ]
                },
                download_production: {
                    options: {
                        bucket: 'my-wonderful-production-bucket'
                    },
                    files: [
                        {
                            dest: 'app/',
                            cwd: 'backup/',
                            action: 'download'
                                    }, // Downloads the content of app/ to backup/
                        {
                            dest: 'assets/',
                            cwd: 'backup-assets/',
                            exclude: "**/*copy*",
                            // Downloads everything which doesn't have copy in the name
                            action: 'download'
                        },
                    ]
                },
                secret: {
                    options: {
                        bucket: 'my-wonderful-private-bucket',
                        access: 'private'
                    },
                    files: [
                        {
                            expand: true,
                            cwd: 'secret_garden/',
                            src: ['*.key'],
                            dest: 'secret/'
                        },
                    ]
                },
            },
        },




        cloudfront: {
            options: {
                region: '<%= aws.region %>', // your AWS region
                distributionId: '<%= aws.dist %>', // DistributionID where files are stored
                credentials: grunt.file.readJSON('aws-keys.json'), // !!Load them from a gitignored file
                listInvalidations: true, // if you want to see the status of invalidations
                listDistributions: false, // if you want to see your distributions list in the console
                // version: '1.0', // if you want to invalidate a specific version (file-1.0.js)
            },
            prod: {
                CallerReference: Date.now().toString(),
                Paths: {
                    // TODO - PARAMETERIZE INVALIDATION ITEMS
                    Quantity: 1,
                    Items: [
                        '/<%= config.awsSub %>/<%= config.adId %>/main-built.js',
                        // '/<%= config.awsSub %>/<%= config.adId %>/assets/**/*.{gif,jpeg,jpg,png,mp4,webm}'
                    ]
                }
            }
        },


        // init invalidation
        invalidate_cloudfront: {
            options: {
                key:  '<%= aws.accessKeyId %>',
                secret: '<%= aws.secretAccessKey %>',
                distribution: '<%= aws.dist %>'
            },
            production: {
                files: [{
                    expand: true,
                    cwd: '<%= config.awsSub %>/<%= config.adId %>/',
                    src: ['**/*'],
                    filter: 'isFile',
                    dest: ''
                }]
            }
        },



        // open browser
        open: {
            dev: {
                path: 'http://<%= config.localIp %>/ads/<%= config.dist %>',
                // app: function () {
                //     // TODO - THIS DOESN'T WORK!!!!!
                //     var b = grunt.option('browser').toString();
                //     grunt.log.writeln('Gruntfile.js: browser:', b);

                //     return b;
                // }
            },
            stage: {
                path: '<%= config.stageRoot %><%= config.stage %>/stage',
            },
            prod: {
                path: '<%= config.stageRoot %><%= config.stage %>',
            }
        },


        // fire off some shell commands
        pythonData: grunt.file.readJSON('.pythonconfig'),
        shell: {
            stage: {
                command: 'python deploystage_ns.py <%= pythonData.key1.base %>/ads/<%= config.dist %> -staging',
                options: {
                    // stdout: true,
                    callback: log,
                    execOptions: {
                        cwd: '<%= pythonData.key1.base %>/fe-scripts'
                    }
                }
            },
            prod: {
                command: 'python deployprod_ns.py <%= pythonData.key1.base %>/ads/<%= config.dist %> -production',
                options: {
                    // stdout: true,
                    callback: log,
                    execOptions: {
                        cwd: '<%= pythonData.key1.base %>/fe-scripts'
                    }
                }
            }
        }

    });




    // shell logger
    function log(err, stdout, stderr, cb) {
        console.log('log: err:', err);
        console.log('log: stdout:', stdout);
        console.log('log: stderr:', stderr);
        console.log('log: cb:', cb);
        cb();
    }




    // grunt.registerTask('serve', function (target) {
    //     if (target === 'dist') {
    //         return grunt.task.run(['build', 'connect:dist:keepalive']);
    //     }

    //     grunt.task.run([
    //         'connect:livereload',
    //         'watch'
    //     ]);
    // });

    // grunt.registerTask('server', function (target) {
    //     grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    //     grunt.task.run([target ? ('serve:' + target) : 'serve']);
    // });

    // run with - grunt deploy:stage
    grunt.registerTask('deploy', function (target) {

        // TODO - DEFAULT TO STAGE?

        if(target === 'stage' || target === 'prod')
        {
            grunt.task.run([
                'copy:' + target,
                'imageoptim',
                'ftp-deploy'
            ]);
        }
        else grunt.log.warn('You need to define "stage" or "prod" as a deployment target.');
    });

    grunt.registerTask('default', [
        'browserSync',
        'watch'
    ]);




    grunt.registerTask('imagetest', function (target) {
        grunt.task.run([
            'imageoptim'
        ]);
    });




    // log watch events
    // grunt.event.on('watch', function(action, filepath, target) {
    //     grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
    // });
};
