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
            app: '[DIR_ROOT]',
            deploy: '[DIR_PROJECT]/deploy',
            dist: '[DIR_PROJECT]/dev',
            stageFtpRoot: '/home/deploy/adcade-blastroid/current/adcade_site/demo/',
            stageRoot: 'http://adcade.com/demo/',
            stage: '[STAGE_PATH_TO_AD]',
            adId: '[AD_ID]',
            localIp: '[LOCAL_IP]',
            awsBucket: 'resource-adcade',
            awsSub: 'ad-assets'
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
        },

        // Syncs instances of app to each other and file changes via node server
        browserSync: {
            dev: {
                bsFiles: {
                    src: [
                        '<%= config.app %><%= config.dist %>/assets/js/**/*.js',
                        '<%= config.app %><%= config.dist %>/assets/img/**/*.gif',
                        '<%= config.app %><%= config.dist %>/assets/img/**/*.jpeg',
                        '<%= config.app %><%= config.dist %>/assets/img/**/*.jpg',
                        '<%= config.app %><%= config.dist %>/assets/img/**/*.png',
                        '<%= config.app %><%= config.dist %>/*.html'
                    ]
                },
                options: {
                    watchTask: true,
                    debugInfo: true
                }
            }
        },

        // Automatically inject Bower components into the HTML file
        bowerInstall: {
            app: {
                src: ['<%= config.app %>index.html'],
                ignorePath: '<%= config.app %>'
            }
        },

        // Scrape all todo statements in code and aggregates to single file
        todos: {
            console_verbose_false : {
                options : {
                    verbose : false
                },
                src : ['<%= config.app %><%= config.dist %>/assets/js/**/*.js']
            },

            custom_reporter : {
                options : {
                    verbose: false,
                    reporter : {
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
                    'todos' : ['<%= config.app %><%= config.dist %>/assets/js/**/*.js']
                }
            }
        },

        // Image compression
        imagemin: {
            options: {
                optimizationLevel: 10,
                pngquant: true
            },
            dynamic: {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %><%= config.dist %>/assets/img/',
                    dest: '<%= config.app %><%= config.dist %>/assets/img/_opt',
                    src: '*.{gif,jpeg,jpg,png}'
                }]
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
        },

        // Migrate assets into deployment folders
        copy: {
            stage: {
                files: [
                    // includes files within path
                    {
                        expand: true,
                        cwd: '<%= config.app %><%= config.dist %>/assets/js/',
                        src: 'main-built.js',
                        dest: '../deploy/stage/assets/js/',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        cwd: '<%= config.app %><%= config.dist %>/assets/img/_opt/',
                        src: '*.{gif,jpeg,jpg,png}',
                        dest: '../deploy/stage/assets/img/',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        cwd: '<%= config.app %><%= config.dist %>/assets/vid/',
                        src: '*.{mp4,webm}',
                        dest: '../deploy/stage/assets/vid/',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        cwd: '<%= config.app %><%= config.dist %>/assets/css/',
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
                        cwd: '<%= config.app %><%= config.dist %>/assets/js/',
                        src: 'main-built.js',
                        dest: '../deploy/prod/',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        cwd: '<%= config.app %><%= config.dist %>/assets/img/_opt/',
                        src: '*.{gif,jpeg,jpg,png}',
                        dest: '../deploy/prod/assets/img/',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        cwd: '<%= config.app %><%= config.dist %>/assets/vid/',
                        src: '*.{mp4,webm}',
                        dest: '../deploy/prod/assets/vid/',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        cwd: '<%= config.app %><%= config.dist %>/assets/css/',
                        src: '*.{css}',
                        dest: '../deploy/prod/assets/css/',
                        filter: 'isFile'
                    }
                ]
            }
        },

        // Alt Sftp module with rsa key
        sftp_rsa: grunt.file.readJSON('.ftppass'),
        sftp: {
            options: {
                host: 'adcade.com',
                // port: 22, // default
                username: 'deploy',
                // password: 'password',
                privateKey: (function(){
                    var path = grunt.file.readJSON('.ftppass').key1.rsaPath;
                    return grunt.file.read(path);
                })(),
                passphrase: '<%= sftp_rsa.key1.password %>',
                path: '<%= config.stageFtpRoot %><%= config.stage %>',
                srcBasePath: '../deploy',
                createDirectories: true,
                showProgress: true
            },
            stage: {
                files: {
                    './': [ '../deploy/stage/**/*' ]
                },
            },
            quickstage: {
                files: {
                    './': [ '../deploy/stage/**/main-built.js' ]
                },
            },
            prod: {
                files: {
                    './': [ '../deploy/prod/index.html' ]
                },
                options: {
                    srcBasePath: '../deploy/prod'
                }
            }
        },

        // AWS bucket
        aws: grunt.file.readJSON('aws-keys.json'),
        aws_s3: {
            options: {
                accessKeyId: '<%= aws.accessKeyId %>', // Use the variables
                secretAccessKey: '<%= aws.secretAccessKey %>', // You can also use env variables
                region: '<%= aws.region %>',
                uploadConcurrency: 5, // 5 simultaneous uploads
                downloadConcurrency: 5, // 5 simultaneous downloads
                // debug: true,
            },
            prod: {
                options: {
                    bucket: '<%= config.awsBucket %>',
                    // differential: true, // Only uploads the files that have changed
                    // params: {
                    //     ContentEncoding: 'gzip' // applies to all the files!
                    // },
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.app %><%= config.deploy %>/prod/',
                        src: [
                            '**/*.png',
                            '**/*.gif',
                            '**/*.jpg',
                            '**/*.jpeg',
                            '**/*.mp4',
                            '**/*.webm',
                            '**/*.js',
                        ],
                        dest: '<%= config.awsSub %>/<%= config.adId %>',
                        exclude: '*.html',
                        // enable stream to allow large files
                        stream: true
                    }
                ],
            },

            quick: {
                options: {
                    bucket: '<%= config.awsBucket %>'
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.app %><%= config.deploy %>/prod/',
                        src: [
                            '**/main-built.js',
                        ],
                        dest: '<%= config.awsSub %>/<%= config.adId %>',
                        exclude: '*.html',
                        // enable stream to allow large files
                        stream: true
                    }
                ],
            },
        },

        // initiate invalidation
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


    //----------------------------------------------------------------------
    //
    // API
    //
    //----------------------------------------------------------------------
    grunt.registerTask('build', function (target) {
        // DEFAULT TO STAGE
        target = target || 'stage';

        var taskList = [
            'shell:' + target,
            // 'todos',
            'newer:imagemin'
        ];

        // run tasks
        grunt.task.run(taskList);
    });

    grunt.registerTask('push', function (target) {
        // DEFAULT TO STAGE
        target = target || 'stage';

        // push aws task into sequence conditionally
        var taskList = [];
        // newer task fails here
        taskList.push('newer:copy:' + target);

        if (target === 'prod') taskList.push('aws_s3:' + target);

        taskList.push('sftp:' + target);
        taskList.push('open:' + target);

        // run tasks
        grunt.task.run(taskList);
    });

    grunt.registerTask('deploy', function (target) {
        // DEFAULT TO STAGE
        target = target || 'stage';

        // push aws task into sequence conditionally
        var taskList = [
            'build:' + target,
            'push:' + target
        ];

        // run tasks
        grunt.task.run(taskList);
    });

    grunt.registerTask('quickdeploy', function (target) {

        // DEFAULT TO STAGE
        target = target || 'stage';

        // push aws task into sequence conditionally
        var taskList = [
            'shell:' + target,
            'newer:copy:' + target,
        ];
        if (target === 'prod')
        {
            taskList.push('aws_s3:quick');
        }
        // newer task fails here
        if(target === 'stage') taskList.push('sftp:quick' + target);
        taskList.push('open:' + target);

        // run tasks
        grunt.task.run(taskList);
    });

    grunt.registerTask('invalidate', [
        'cloudfront'
    ]);

    grunt.registerTask('default', [
        'browserSync',
        'open:dev',
        'watch'
    ]);

    // log watch events
    // grunt.event.on('watch', function(action, filepath, target) {
    //     grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
    // });
};
