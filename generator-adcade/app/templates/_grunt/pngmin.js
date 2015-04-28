module.exports = function(grunt, options)
{
	return {

        compile: {
            options: {
                ext: '.png',
                // colors: 128, // reduce colors to
                quality: '0-100', // 0-100
                force: true // overwrite if existing
            },
            files: [{
                expand: true, // required option
                src: ['*.png'],
                cwd: '<%= app %><%= dist %>/assets/img', // required option
                dest: '<%= app %><%= dist %>/assets/img/_opt/'
            }]
        }
    };


};