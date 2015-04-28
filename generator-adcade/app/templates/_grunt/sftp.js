module.exports = function(grunt, options)
{
	return {

        // upload to demo server via sftp
        options: {
            host: 'adcade.com',
            // port: 22, // default
            username: 'deploy',
            // password: 'password',
            privateKey: (function(){
                // assemble path then read rsa file
                var path = grunt.file.readJSON('grunt/config/.ftppass').rsaPath;
                return grunt.file.read(path);
            })(),
            passphrase: '<%= ftpPassword %>',
            path: '<%= stageFtpRoot %><%= stage %>',
            srcBasePath: '<%= app %><%= deploy %>',
            createDirectories: true,
            showProgress: true
        },
        stage: {
            files: {
                // './': (function(){
                //         var changeList = grunt.file.readJSON('changelist.json');
                //         var uploads = [];
                //         for(var i = 0; i < changeList.length; i++)
                //         {
                //             var item = changeList[i];

                //             // convert to invalidation list
                //             var rev = (item.search('index.html') > -1)
                //                 ? '<%= app %><%= deploy %>/stage/index.html'
                //                 : '<%= app %><%= deploy %>/stage/assets' + item.split('assets')[1];
                //             uploads.push(rev);
                //         }
                //         uploads.push('<%= app %><%= deploy %>/stage/index.html');
                //         // console.log('sftp.js: uploads:', uploads);

                //         return uploads;
                //     })()
                './': [ '<%= app %><%= deploy %>/stage/**/*' ]
            },
        },
        quickstage: {
            files: {
                './': [ '<%= app %><%= deploy %>/stage/**/main-built.js' ]
            },
        },
        prod: {
            files: {
                './': [ '<%= app %><%= deploy %>/prod/index.html' ]
            },
            options: {
                srcBasePath: '<%= app %><%= deploy %>/prod'
            }
        }

	};
};