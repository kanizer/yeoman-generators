module.exports = function(grunt, options)
{
	return {

		// launch site in browser
        dev: {
            path: 'http://<%= localIp %>/ads/<%= dist %>',
            // app: function () {
            //     // TODO - THIS DOESN'T WORK!!!!!
            //     var b = grunt.option('browser').toString();
            //     grunt.log.writeln('Gruntfile.js: browser:', b);

            //     return b;
            // }
        },
        stage: {
            path: '<%= stageRoot %><%= stage %>/stage',
        },
        prod: {
            path: '<%= stageRoot %><%= stage %>',
        }

	};
};