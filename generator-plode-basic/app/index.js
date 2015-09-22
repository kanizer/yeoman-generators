'use strict';
var path   = require('path'),
    yeoman = require('yeoman-generator'),
    chalk  = require('chalk');

module.exports = yeoman.generators.Base.extend({

    askFor: function() {
        // async completion callback
        var done = this.async();

        // have Yeoman greet the user
        this.log(this.yeoman);

        // replace it with a short and sweet description of your generator
        this.log(chalk.magenta('You\'re using the Plode Basic Generator.'));

        // prompt user for dynamic content
        var prompts = [{
            // type: 'input',
            name: 'projectId',
            message: 'Name your project:',
            // default: null,
            validate: function (input) {
                // need to declare async within this closure
                var validated = this.async();
                if(!input || input.length === 0) {
                    validated('You need to name your project.');
                    return;
                }
                validated(true);
            }
        },
        {
            name: 'desc',
            message: 'Describe your project:',
            default: 'No description.'
        }];

        // assign prompt responses to array vars
        this.prompt(prompts, function (props) {
            this.projectId = props.projectId;
            this.desc = props.desc;
            done();
        }.bind(this));
    },

    app: function() {
        // copy config files
        this.copy('_.gitignore', '.gitignore');
        this.copy('_.eslintrc', '.eslintrc');
        this.copy('_gulpfile.js', 'gulpfile.js');

        // copy directories
        this.directory('_gulp', 'gulp/');
        this.directory('_src', 'src/');

        // inject content into templates name/desc
        var pkg = this.readFileAsString(path.join(this.sourceRoot(), '_package.json'))
            .replace(/\{\{PROJ_NAME\}\}/g, this.projectId)
            .replace(/\{\{PROJ_DESC\}\}/g, this.desc);
        this.write('package.json', pkg);

        var readme = this.readFileAsString(path.join(this.sourceRoot(), '_README.md'))
            .replace(/\{\{PROJ_NAME\}\}/g, this.projectId)
            .replace(/\{\{PROJ_DESC\}\}/g, this.desc);
        this.write('README.md', readme);
    },

    end: function() {
        console.log(chalk.bold.yellow('Project scaffold complete - you should npm i and setup git props if you intend to.'));
    }
});
