module.exports = function(grunt, options)
{
    var conf = grunt.file.readJSON('grunt/config/.main');
    var prepend = '/' + conf.awsSub + '/' + conf.adId + '/assets';
	var changeList, invalidationList;
	return {

		// invalidate cloudfront assets
        options: {
            region: '<%= awsRegion %>', // your AWS region
            distributionId: '<%= awsDist %>', // DistributionID where files are stored
            credentials: grunt.file.readJSON('grunt/config/.aws'),
            listInvalidations: true, // if you want to see the status of invalidations
            listDistributions: false, // if you want to see your distributions list in the console
            // version: '1.0', // if you want to invalidate a specific version (file-1.0.js)
        },
        prod: {
            CallerReference: Date.now().toString(),
            Paths: {
                // PARAMETERIZE INVALIDATION ITEMS
                Quantity: (function(){
                	changeList = grunt.file.readJSON('invalidation.json');
                	return changeList.length;
                })(),
                Items: (function(){
                	changeList = grunt.file.readJSON('invalidation.json');
                    invalidationList = [];
                    for(var i = 0; i < changeList.length; i++)
                    {
                        var item = changeList[i];

                        // convert to invalidation list
                        if(item.search('main-built') > -1) prepend = prepend.replace('/assets', '/');
                        var rev = prepend + item;
                        invalidationList.push(rev);
                    }
                    console.log('cloudfront.js: invalidationList:', invalidationList);

                	return invalidationList;
                })(),
                // Items: ['<%= config.invalid %>']
                // [
                //     '/<%= awsSub %>/<%= adId %>/main-built-small.js',
                // ]
            }
        }

	};
};