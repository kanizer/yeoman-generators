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
    ifaces[dev].forEach(function(details) {
        if (dev === 'en0' && details.family == 'IPv4') {
            localIp = details.address;
        }
    });
}

var AdcadeGenerator = yeoman.generators.Base.extend({

    init: function() {
        this.pkg = require('../package.json');
        this.relPath = this.destinationRoot().split('Sites')[1];
        this.sandboxId = this.relPath.split('/');
        this.sandboxId = this.sandboxId[this.sandboxId.length-1];
    },

    askFor: function() {
        // have Yeoman greet the user
        this.log(this.yeoman);

        // replace it with a short and sweet description of your generator
        this.log(chalk.magenta('You\'re using the fantastic Adcade generator.'));
        
        var done = this.async();
        done();
    },

    app: function() {
        this.copy('_.gitignore', '.gitignore');
        this.copy('_.gitattributes', '.gitattributes');
        this.copy('_.jshintignore', '.jshintignore');
        this.copy('_.jshintrc', '.jshintrc');

        // assets
        var unitAssetPath = '_assets/';
        this.directory(unitAssetPath, 'assets/');

        // update require.conf.js relative path
        var levels = this.relPath.split('/'), requirePath = '';
        for(var i = 0; i < levels.length; i++) {
            requirePath += '../';
        }

        var requireConfContent = this.readFileAsString(path.join(this.sourceRoot(), '_assets/js/require.conf.js'))
            .replace(/\[RELATIVE_PATH]/g, requirePath);
        this.write('assets/js/require.conf.js', requireConfContent);

        // console.log(chalk.bold.yellow(this.sourceRoot()));
        var configContent = this.readFileAsString(path.join(this.sourceRoot(), '_.main'));
        configContent = JSON.parse(configContent);
        this.write('.main', JSON.stringify(configContent));
    },

    addIndexFiles: function() {
        var indexFileContent = this.readFileAsString(path.join(this.sourceRoot(), '_index.html'))
            .replace(/\[SANDBOX_ID]/g, this.sandboxId)
            .replace(/\[PROJECT_PATH]/g, this.relPath)
            .replace(/\[LOCAL_YO_IP]/g, localIp);
        this.write('index.html', indexFileContent);
    }

});

module.exports = AdcadeGenerator;