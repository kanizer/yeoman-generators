module.exports = function(grunt, options)
{
	return {

        // copy files to deployment directories
        stage: {
            files: [
                // includes files within path
                {
                    expand: true,
                    cwd: '<%= app %><%= dist %>/assets/js/',
                    src: 'main-built.js',
                    dest: '<%= app %><%= deploy %>/stage/assets/js/',
                    filter: 'isFile'
                },
                {
                    expand: true,
                    cwd: '<%= app %><%= dist %>/assets/img/_opt/',
                    src: '*.{gif,jpeg,jpg,png}',
                    dest: '<%= app %><%= deploy %>/stage/assets/img/',
                    filter: 'isFile'
                },
                {
                    expand: true,
                    cwd: '<%= app %><%= dist %>/assets/vid/',
                    src: '*.{mp4,webm}',
                    dest: '<%= app %><%= deploy %>/stage/assets/vid/',
                    filter: 'isFile'
                },
                {
                    expand: true,
                    cwd: '<%= app %><%= dist %>/assets/css/',
                    src: '*.css',
                    dest: '<%= app %><%= deploy %>/stage/assets/css/',
                    filter: 'isFile'
                }
            ]
        },
        prod: {
            files: [
                {
                    expand: true,
                    cwd: '<%= app %><%= dist %>/assets/js/',
                    src: 'main-built-small.js',
                    dest: '<%= app %><%= deploy %>/prod/',
                    filter: 'isFile',
                    rename: function(dest, src)
                    {
                        return dest + src.replace('main-built-small.js', 'main-built.js');
                    }
                },
                {
                    expand: true,
                    cwd: '<%= app %><%= dist %>/assets/img/_opt/',
                    src: '*.{gif,jpeg,jpg,png}',
                    dest: '<%= app %><%= deploy %>/prod/assets/img/',
                    filter: 'isFile'
                },
                {
                    expand: true,
                    cwd: '<%= app %><%= dist %>/assets/vid/',
                    src: '*.{mp4,webm}',
                    dest: '<%= app %><%= deploy %>/prod/assets/vid/',
                    filter: 'isFile'
                },
                {
                    expand: true,
                    cwd: '<%= app %><%= dist %>/assets/css/',
                    src: '*.css',
                    dest: '<%= app %><%= deploy %>/prod/assets/css/',
                    filter: 'isFile'
                }
            ]
        }

	};
};