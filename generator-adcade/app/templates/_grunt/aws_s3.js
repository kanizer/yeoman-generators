module.exports = function(grunt, options)
{
	return {

		// upload to aws
        options: {
            accessKeyId: '<%= accessKeyId %>', // Use the variables
            secretAccessKey: '<%= secretAccessKey %>', // You can also use env variables
            region: '<%= awsRegion %>',
            uploadConcurrency: 5, // 5 simultaneous uploads
            downloadConcurrency: 5, // 5 simultaneous downloads
            // debug: true,
        },

        prod: {
            options: {
                bucket: '<%= awsBucket %>',
                // differential: true, // Only uploads the files that have changed
            },
            files: [
                {
                    expand: true,
                    cwd: '<%= app %><%= deploy %>/prod/',
                    src: 
                    (function(){
                        var changeList = grunt.file.readJSON('changelist-prod.json');
                        var uploads = [];
                        for(var i = 0; i < changeList.length; i++)
                        {
                            var item = changeList[i];

                            // convert to upload list
                            var rev = (item.search('assets') > -1) ? 'assets' + item.split('assets')[1] : item;
                            if(rev !== '' && uploads.indexOf(rev) < 0 && rev.indexOf('main-built.js' < 0)) uploads.push(rev);
                        }

                        console.log('aws_s3.js: uploads:', uploads);
                        return uploads;
                    })(),
                    dest: '<%= awsSub %>/<%= adId %>',
                    exclude: '*.html',
                    // enable stream to allow large files
                    stream: true
                }
            ]
        },

        quick: {
            options: {
                bucket: '<%= awsBucket %>',
                params: {'ContentEncoding': 'gzip'}
            },
            files: [
                {
                    expand: true,
                    cwd: '<%= app %><%= deploy %>/prod/',
                    src: ['**/main-built.js'],
                    dest: '<%= awsSub %>/<%= adId %>',
                    stream: true
                }
            ],
        }

	};
};