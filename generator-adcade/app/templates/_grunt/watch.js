module.exports = function(grunt, options)
{
    // log watch events
    grunt.event.on('watch', function(action, filepath, target) {
        grunt.log.writeln('watch task: ' + target + ': ' + filepath + ' has ' + action);

        // create hash map of changed files
        var path = 'changelist.json';
        var json = grunt.file.readJSON(path);
        if(json.indexOf(filepath) === -1 && action !== 'deleted' && filepath.indexOf('Gruntfile.js') === -1) json.push(filepath);
        if(json.indexOf(filepath) > -1 && action === 'deleted' && filepath.indexOf('Gruntfile.js') === -1) json.splice(json.indexOf(filepath), 1);
        grunt.file.write(path, JSON.stringify(json));

        // prod
        json = grunt.file.readJSON('changelist-prod.json');
        filepath = filepath.replace('../dev/', '')
            .replace('img/_opt', 'img')
            .replace('assets/js/main-built.js', 'main-built.js');

        if(json.indexOf(filepath) === -1 && action !== 'deleted' && filepath.indexOf('Gruntfile.js') === -1) json.push(filepath);
        if(json.indexOf(filepath) > -1 && action === 'deleted' && filepath.indexOf('Gruntfile.js') === -1) json.splice(json.indexOf(filepath), 1);
        grunt.file.write('changelist-prod.json', JSON.stringify(json));
    });

	return {

        options: {
            dateFormat: function(time) {
                grunt.log.writeln('The watch finished in ' + time + 'ms at' + (new Date()).toString());
                grunt.log.writeln('Waiting for more changes...');
            }
        },

        // Watches files for changes and runs tasks based on the changed files
        // I DON'T THINK THIS WORKS - HAVE TO RERUN GRUNT ANYWAY
        // gruntfile: {
        //     files: ['Gruntfile.js']
        // },

        // create changelist
        deploy: {
            // causes error...
            // options: {
            //     cwd: '<%= app %><%= dist %>'
            // },
            files: [
                '<%= app %><%= dist %>/assets/js/main-built.js',
                '<%= app %><%= dist %>/assets/img/_opt/*.png',
                '<%= app %><%= dist %>/assets/img/_opt/*.jpeg',
                '<%= app %><%= dist %>/assets/img/_opt/*.jpg',
                '<%= app %><%= dist %>/assets/img/_opt/*.gif',
                '<%= app %><%= dist %>/assets/vid/*.mp4',
                '<%= app %><%= dist %>/assets/vid/*.webm',
                '<%= app %><%= dist %>/assets/css/*.css'
            ],
            // tasks: [
            //     'listfiles'
            // ]
        }

	};
};