var path = require('path');
module.exports = function (grunt) {

	function jsonConcat(o1, o2) {
		for (var key in o2) {
			o1[key] = o2[key];
		}
		return o1;
	}

	// load config json
	var conf = grunt.file.readJSON('grunt/config/.main'),
		aws = grunt.file.readJSON('grunt/config/.aws'),
		sftp = grunt.file.readJSON('grunt/config/.ftppass');

	// concat configs
	conf = jsonConcat(conf, sftp);
	conf = jsonConcat(conf, aws);

	// Time how long tasks take. Can help when optimizing build times
	require('time-grunt')(grunt);

	// allows loading external task configs
	require('load-grunt-config')(grunt, {
		data: conf
	});
};