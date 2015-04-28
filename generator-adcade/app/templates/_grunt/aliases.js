module.exports = function(grunt) {

    // load config json
    var conf = grunt.file.readJSON('grunt/config/.main');

	//----------------------------------------------------------------------
	//
	// DEFINE TASK ALIASES
	//
	//----------------------------------------------------------------------
    grunt.registerTask('default', [
    	'browserSync',
    	'open:dev',
        'watch'
    ]);

    grunt.registerTask('invalidate', function()
    {
        grunt.task.run(['cloudfront']);

        // clear list
        grunt.file.write('invalidation.json', '[]');
    });

    grunt.registerTask('build', function (target) {
        // DEFAULT TO STAGE
        target = target || 'stage';

        var taskList = [
            'shell:' + target,
            // 'todos',
            'newer:imagemin',
            'newer:pngmin'
        ];

        // add to changelist
        var docTarget = target === 'prod' ? 'changelist-prod.json' : 'changelist.json';
        var json = grunt.file.readJSON(docTarget);
        if(json.indexOf('main-built.js') < 0)
        {
            if(target === 'prod') json = json.concat(json, ['main-built.js']);
            else json = json.concat(json, ['assets/js/main-built.js']);
        }
        grunt.file.write(docTarget, JSON.stringify(json));

        // run tasks
        grunt.task.run(taskList);
    });

    grunt.registerTask('dist', function (target) {
        // DEFAULT TO STAGE
        target = target || 'stage';

        // push aws task into sequence conditionally
        var taskList = [];
        // newer task fails here
        taskList.push('check-new:' + target);
        if(target === 'prod') taskList.push('newer:copy:' + target);

        // run tasks
        grunt.task.run(taskList);
    });

    grunt.registerTask('deploy', function (target) {
        // DEFAULT TO STAGE
        target = target || 'stage';

        // push aws task into sequence conditionally
        var taskList = [
            'build:' + target,
            'dist:' + target
        ];

        // run tasks
        grunt.task.run(taskList);
    });

    grunt.registerTask('push', function (target) {
        // DEFAULT TO STAGE
        target = target || 'stage';

        // push aws task into sequence conditionally
        var taskList = [];
        if (target === 'prod')
        {
            var changeList = grunt.file.readJSON('changelist-prod.json');
            var index = changeList.indexOf('main-built.js');
            if(index > -1) changeList.splice(index, 1);
            if(changeList.length > 0)
            {
                taskList.push('aws_s3:prod');
                taskList.push('aws_s3:quick');
            }
        }

        taskList.push('sftp:' + target);
        taskList.push('open:' + target);
        taskList.push('clear-changelist:' + target);

        // run tasks
        grunt.task.run(taskList);
    });

    grunt.registerTask('deploypush', function (target) {
        // DEFAULT TO STAGE
        target = target || 'stage';

        // push aws task into sequence conditionally
        var taskList = [];
        taskList.push('deploy:' + target);
        taskList.push('push:' + target);

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
        taskList.push('clear-changelist:' + target);

        // run tasks
        grunt.task.run(taskList);
    });

    grunt.registerTask('preload', function() {

        // create list of image assets
        var preloadString = 'media: [';
        var files = grunt.file.expand({
            expand: true, cwd: conf.app + conf.dist + '/assets/img'
            }, ['*.{gif,jpeg,jpg,png}']);

        files.forEach(function(filename, i){
            if(filename !== 'backup.jpg')
            {
                // console.log('Gruntfile.js: files: filename', filename);
                preloadString += "'img/" + filename + "'";
                if(i < files.length-1) preloadString += ', ';
            }
        });
        preloadString += ']';

        // write to main.js
        var path = conf.app + conf.dist + '/assets/js/main.js';
        var content = grunt.file.read(path);
        var match = content.replace(/media: \[(.*?)\]/, preloadString);

        // console.log('aliases.js: content:', match);
        grunt.file.write(path, match);
    });

    grunt.registerTask('listfiles', function() {
        // var files = grunt.file.expand({ // Dictionary of files
        //     expand: true,
        //     cwd: conf.app + conf.dist + '/assets/'
        // },[
        //     'js/main-built-small.js',
        //     'img/_opt/*.{gif,jpeg,jpg,png}',
        //     'vid/*.{mp4,webm}',
        //     'css/*.css'
        // ]).forEach(function(filename){
        //     console.log('Gruntfile.js: files: filename', filename);
        // });

        var log = grunt.file.read('changelist.json');
        for(var i = 0; i < JSON.parse(log).length; i++)
        {
            var item = JSON.parse(log)[i];

            // convert to invalidation list
            var rev = '/' + conf.awsSub + '/' + conf.adId + '/assets' + item.split('assets')[1];
            if(item.search('main-built-small.js') > -1) rev = '/' + conf.awsSub + '/' + conf.adId + '/main-built-small.js';
            console.log('aliases.js: listfiles: item:', rev);
        }
    });

    grunt.registerTask('clear-changelist', function(target) {
        var path = target === 'stage' ? 'changelist.json' : 'changelist-prod.json';
        grunt.file.write(path, '[]');
    });

    grunt.registerTask('check-new', function(target){

        var src = [], dest = [],
            dirSrc = conf.app + conf.dist,
            dirDest = target === 'prod' ? '../deploy/prod/' : '../deploy/stage/';

        // get src directory contents
        grunt.file.expand({
            expand: true,
            cwd: dirSrc
        },[
            'assets/css/*.css',
            'assets/img/*.{png,jpg,jpeg,gif}',
            'assets/vid/*.{mp4,webm}',
            'index.html'
        ]).forEach(function(filename){
            src.push(filename);
        });

        // get dest contents
        grunt.file.expand({
            expand: true,
            cwd: dirDest
        },[
            'assets/css/*.css',
            'assets/img/*.{png,jpg,jpeg,gif}',
            'assets/vid/*.{mp4,webm}',
            'index.html'
        ]).forEach(function(filename){
            dest.push(filename);
        });

        // items missing in dest
        var diff = src.filter(function(i) {
            return dest.indexOf(i) < 0;
        });

        // console.log('Gruntfile.js: files: src', src);
        // console.log('Gruntfile.js: files: dest', dest);
        // console.log('Gruntfile.js: files: diff', diff);

        // update changelists
        var docTarget = target === 'prod' ? 'changelist-prod.json' : 'changelist.json';
        var json = grunt.file.readJSON(docTarget);
        for(var i = 0; i < diff.length; i++)
        {
            // json.push(dirDest + diff[i]);
            json.push(diff[i]);
        }

        grunt.file.write(docTarget, JSON.stringify(json));

        // update invalidation list
        json = grunt.file.readJSON('changelist-prod.json');
        grunt.file.write('invalidation.json', JSON.stringify(json));

        console.log('aliases.js: complete');
    });
};