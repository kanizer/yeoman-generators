module.exports = function(grunt, options)
{
	return {

        // optimize images
        options: {
            optimizationLevel: 7
            // pngquant: true
        },
        dynamic: {
            files: [{
                expand: true,
                cwd: '<%= app %><%= dist %>/assets/img/',
                dest: '<%= app %><%= dist %>/assets/img/_opt',
                src: '*.{gif,jpeg,jpg}'
            }]
        }

	};
};