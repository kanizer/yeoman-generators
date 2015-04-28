module.exports = function(grunt, options)
{
	return {

		// Syncs instances of app to each other and file changes via node server
		dev: {
			bsFiles: {
				src: [
				'<%= app %><%= dist %>/assets/js/**/*.js',
				'<%= app %><%= dist %>/assets/js/**/**/*.js',
				'<%= app %><%= dist %>/assets/img/*.gif',
				'<%= app %><%= dist %>/assets/img/*.jpeg',
				'<%= app %><%= dist %>/assets/img/*.jpg',
				'<%= app %><%= dist %>/assets/img/*.png',
				'<%= app %><%= dist %>/*.html'
				]
			},
			options: {
				watchTask: true,
				debugInfo: true
			}
		}
	};
};