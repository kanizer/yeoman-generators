module.exports = function(grunt, options)
{
	return {

        minify: {
            expand: true,
            cwd: '<%= app %><%= dist %>/assets/css/',
            src: ['*.css', '**/*.css'],
            dest: '<%= app %><%= dist %>/assets/css/',
            ext: '.min.css'
        }

	};
};