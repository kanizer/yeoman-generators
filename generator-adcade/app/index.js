'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var os = require('os');

// derive ip address
var ifaces = os.networkInterfaces();
var localIp;
for (var dev in ifaces) {
    // var alias = 0;
    ifaces[dev].forEach(function(details){
    //     if (details.family == 'IPv4') {

    //         console.log('index.js: dev:', dev);
    //         console.log('index.js: alias:', alias);
    //         console.log('index.js: details:', details);
    //         console.log(dev + (alias ? ':' + alias : ''), details.address);

    //         ++alias;
    //     }
    
        if(dev === 'en0' && details.family == 'IPv4')
        {
            localIp = details.address;
        }
    });
}

// console.log('index.js: address:', localIp);

var AdcadeGenerator = yeoman.generators.Base.extend({
    init: function () {
        this.pkg = require('../package.json');

        // this.on('end', function () {
        //     if (!this.options['skip-install']) {
        //         process.chdir('build/');
        //         this.installDependencies();
        //     }
        // });
    },

    askFor: function () {
        var done = this.async();

        // have Yeoman greet the user
        this.log(this.yeoman);

        // replace it with a short and sweet description of your generator
        this.log(chalk.magenta('You\'re using the fantastic Adcade generator.'));

        var prompts = [
            {
                // type: 'confirm',
                name: 'adId',
                message: 'What is the ad ID?',
                validate: function (input) {
                    var done = this.async();
                    if (input.length === 0)
                    {
                        done('You need to supply an ad ID');
                        return;
                    }

                    done(true);
                }
                // default: true
            },
            {
                name: 'fwVersion',
                message: 'What framework version are you using?',
            },
            {
                name: 'pathStage',
                message: 'What is the staging url?',
            },
            {
                name: 'relDeploy',
                message: 'What is the relative deploy directory (deploy)?',
            },
            {
                name: 'relDist',
                message: 'What is the relative dev directory (dev)?',
            },
            {
                name: 'relRoot',
                message: 'What is the relative root path (localhost)?',
            },
            {
                name: 'unitType',
                message: 'What kind of ad unit do you want to build?',
                type: 'list',
                choices: [
                    'in-page',
                    'medialets',
                    'filmstrip',
                    'pushdown'
                ]
            },
            // {
            //     name: 'collapsedW',
            //     message: 'What is the collapsed width of this ad?'

            // },
            // {
            //     name: 'collapsedH',
            //     message: 'What is the collapsed height of this ad?'

            // },
            // {
            //     name: 'expandedW',
            //     message: 'What is the expanded width of this ad?'
            // },
            // {
            //     name: 'expandedH',
            //     message: 'What is the expanded height of this ad?'
            // },
        ];

        // assign prompt responses to array vars
        this.prompt(prompts, function (props) {
            // this.someOption = props.someOption;

            this.adId = props.adId;
            this.fwVersion = props.fwVersion.length > 0 ? props.fwVersion : '1.7';
            this.pathStage = props.pathStage.length > 0 ? props.pathStage : undefined;
            this.relDeploy = props.relDeploy.length > 0 ? props.relDeploy : 'deploy/';
            this.relDist = props.relDist.length > 0 ? props.relDist : '';
            this.relRoot = props.relRoot.length > 0 ? props.relRoot : '../../../../../../../';
            this.unitType = props.unitType.length > 0 ? props.unitType : 'in-page';
            // this.collapsedW = props.collapsedW.length > 0 ? props.collapsedW : 300;
            // this.collapsedH = props.collapsedH.length > 0 ? props.collapsedH : 250;
            // this.expandedW = props.expandedW.length > 0 ? props.expandedW : 600;
            // this.expandedH = props.expandedH.length > 0 ? props.expandedH : 600;
            // this.collapsedW += 'px';
            // this.collapsedH += 'px';
            // this.expandedW += 'px';
            // this.expandedH += 'px';

            done();
        }.bind(this));
    },

    app: function () {

        this.copy('_.gitignore', '.gitignore');
        this.copy('_.gitattributes', '.gitattributes');
        this.copy('_.jshintignore', '.jshintignore');
        this.copy('_.jshintrc', '.jshintrc');

        // assets
        var unitAssetPath;
        switch(this.unitType)
        {
            case 'in-page':
                unitAssetPath = '_assets/';
                break;

            case 'filmstrip':
                unitAssetPath = '_assets_filmstrip/';
                break;

            case 'pushdown':
                unitAssetPath = '_assets_pushdown/';
                break;

            case 'medialets':
                unitAssetPath = '_assets_pushdown/';
                break;
        }
        this.directory(unitAssetPath, 'dev/assets/');
        // this.directory('_grunt', 'build/grunt/');

        // update config in main.js
        // var mainJs = this.readFileAsString(path.join(this.sourceRoot(), unitAssetPath + '/js/main.js'));
        // mainJs = mainJs.replace(/\[DIR_ROOT]/g, this.relRoot)
        //     .replace(/\[DIR_PROJECT]/g, relPath)
        //     .replace(/\[STAGE_PATH_TO_AD]/g, this.pathStage)
        //     .replace(/\[AD_ID]/g, this.adId);
        // this.write('build/Gruntfile.js', mainJs);

        // build dir
        // this.mkdir('build');
        // this.copy('_deployconfig.py', 'build/deployconfig.py');
        // this.copy('_invalidation.json', 'build/invalidation.json');
        // this.copy('_changelist-prod.json', 'build/changelist-prod.json');
        // this.copy('_changelist.json', 'build/changelist.json');
        // this.copy('_Gruntfile.js', 'build/Gruntfile.js');

        // populate project relative values
        var relPath = this.destinationRoot().split('ads/')[1];

        var configContent = this.readFileAsString(path.join(this.sourceRoot(), '_.main'));
        configContent = JSON.parse(configContent);
        configContent.stage = this.pathStage;
        configContent.adId = this.adId;
        configContent.dist = this.relDist;

        //     // .replace(/\[DIR_ROOT]/g, this.relRoot)
        //     // .replace(/\[DIR_PROJECT]/g, relPath)
        //     .replace(/\[STAGE_PATH_TO_AD]/g, this.pathStage)
        //     // .replace(/\[LOCAL_IP]/g, localIp)
        //     .replace(/\[AD_ID]/g, this.adId);
        // // this.write('build/grunt/config/.main', configContent);
        // this.write('.main', configContent);
        this.write('.main', JSON.stringify(configContent));

        console.log('index.js: configContent:', configContent);

        // browser-sync config
        // this.copy('_bs-config.js', 'build/bs-config.js');

        // node/bower dependencies
        // this.copy('_package.json', 'build/package.json');
        // this.copy('_bower.json', 'build/bower.json');
    },

    addIndexFiles: function () {

        // ref to methods/props
        // for(var key in this.dest)
        // {
        //   this.log(key + ': ' + this[key]);
        // }

        // template for making placements
        // this.copy('_index.html.template', 'dev/index.html.template');

        // prod
        var indexFileContent = this.readFileAsString(path.join(this.sourceRoot(), '_index-prod.html'));
        // indexFileContent = indexFileContent.replace(/<REQUIRE>(.*?)<\/REQUIRE>/g, 'new copy here');
        //.replace(/\[perc]/g, '%');
        indexFileContent = indexFileContent.replace(/\[AD_ID]/g, this.adId)
            .replace(/\[FWVERSION]/g, this.fwVersion);
        this.write('deploy/prod/index.html', indexFileContent);


        // medialets
        if(this.unitType === 'medialets')
        {
            indexFileContent = this.readFileAsString(path.join(this.sourceRoot(), '_index-medialets.html'));
            indexFileContent = indexFileContent.replace(/\[EXPAND]/g, '');
            this.write('../combined_bundle/index.html', indexFileContent);
            indexFileContent = this.readFileAsString(path.join(this.sourceRoot(), '_index-medialets.html'));
            indexFileContent = indexFileContent.replace(/\[EXPAND]/g, '-expanded');
            this.write('../combined_bundle/expandable.html', indexFileContent);
        }

        // // stage
        // if (this.pathStage !== undefined)
        // {
        //     indexFileContent = this.readFileAsString(path.join(this.sourceRoot(), '_index-stage.html'))
        //         .replace(/\[AD_ID]/g, this.adId)
        //         .replace(/\[FWVERSION]/g, this.fwVersion)
        //         .replace(/\[STAGE_PATH_TO_AD]/g, this.pathStage);
        //     this.write('deploy/stage/index.html', indexFileContent);
        // }

        // local
        var relPath = this.destinationRoot().split('staging/')[1];
        indexFileContent = this.readFileAsString(path.join(this.sourceRoot(), '_index-local.html'))
            .replace(/\[AD_ID]/g, this.adId)
            .replace(/\[FWVERSION]/g, this.fwVersion)
            .replace(/\[LOCAL_PATH_TO_AD]/g, relPath)
            .replace(/\[LOCAL_IP]/g, localIp);
        this.write('dev/index.html', indexFileContent);
    }

});

module.exports = AdcadeGenerator;