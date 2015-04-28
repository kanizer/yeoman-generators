module.exports = function(grunt, options)
{
    // shell logger
    function log(err, stdout, stderr, cb) {
        console.log('log: err:', err);
        console.log('log: stdout:', stdout);
        console.log('log: stderr:', stderr);
        console.log('log: cb:', cb);
        cb();
    }

	return {

        // execute python deployer
        stage: {
            command: 'python deploy.py <%= basePath %>/ads/<%= dist %> -metrics replaceresources=False serverhost="ad-stage.adcade.com" createtag=False',
            options: {
                // stdout: true,
                callback: log,
                execOptions: {
                    cwd: '<%= basePath %>/syrupy/build'
                }
            }
        },
        prod: {
            command: 'python deploy.py <%= basePath %>/ads/<%= dist %> -metrics createtag=False',
            options: {
                // stdout: true,
                callback: log,
                execOptions: {
                    cwd: '<%= basePath %>/syrupy/build'
                }
            }
        }

	};
};