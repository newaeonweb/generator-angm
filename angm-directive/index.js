'use strict';
var util = require('util');
var chalk = require('chalk');
var generators = require('yeoman-generator');
var yosay = require('yosay');
var slugify = require("underscore.string/slugify");
var s = require('underscore.string');
var _ = require('underscore');
_.mixin(require('underscore.inflections'));
var mkdirp = require('mkdirp');


var ModuleGenerator = generators.Base.extend({
  init: function () {

    // Greetings to the user.
    this.log(yosay(
      'Ohhh ' + chalk.cyan('Let\`s create a new directive') + ' now!'
    ));

    this.slugifiedName = slugify(this.name);

    // Get app name from config.
    this.nameApp = this.config.get('appName');

    // Get app options from config
    this.angularCookies = this.config.get('angularCookies');
    this.angularAnimate = this.config.get('angularAnimate');
    this.angularTouch = this.config.get('angularTouch');
    this.angularSanitize = this.config.get('angularSanitize');

    console.log(chalk.white('Attention', chalk.underline.bgRed('name your directives with camelCase.') + '!'));

  },

  askForDirectiveName: function () {
    var done = this.async();

    var prompts = [{
      name: 'moduleName',
      message: 'What would you like to call the Directive?',
      default: 'Directive name must be here'
    }];

    this.prompt(prompts, function (props) {
      this.moduleName = props.moduleName;

      this.slugifiedName = slugify(this.moduleName);

      this.slugifiedNameCapitalize = _.camelize(this.moduleName);

      this.slugifiedNameCamelize = s.decapitalize(this.moduleName);

      // Get Directives from user config
      this.modules = this.config.get('directives');

      if (!this.modules) {
        this.modules = [];
      }

      for (var i = 0; i < this.modules.length; i++) {

        this.listModules = this.modules[i].name;

        if (this.slugifiedName === this.listModules) {

          return this.log.writeln(chalk.red(' Directive name already exists'));

        }
      }
      ;

      this.modules.push({name: this.slugifiedName});

      this.config.set('directives', this.modules);

      done();
    }.bind(this));
  },

  askForDirectiveFolder: function () {
    var done = this.async();

    var prompts = [{
      type: 'checkbox',
      name: 'folders',
      message: 'Which files would you like your Directive to include?',
      choices: [{
        value: 'addControllerFile',
        name: 'External Controller',
        checked: true
      }, {
        value: 'addTemplateFile',
        name: 'External Template',
        checked: true
      }, {
        value: 'addAssetsFolder',
        name: 'Assets folder',
        checked: true
      }]
    }];

    this.prompt(prompts, function (props) {
      this.addControllerFile = _.contains(props.folders, 'addControllerFile');
      this.addTemplateFile = _.contains(props.folders, 'addTemplateFile');
      this.addAssetsFolder = _.contains(props.folders, 'addAssetsFolder');

      done();
    }.bind(this));
  },

  renderModule: function () {
    // Create Directive folder
    mkdirp('app/modules/shared/directives/');

    // Render Directive definition
    if (this.addControllerFile) {
      this.template('_controller.js', 'app/modules/shared/directives/' + this.slugifiedName + '/' + this.slugifiedName + 'Ctrl.js');
    }
    if (this.addTemplateFile) {
      this.template('_template.html', 'app/modules/shared/directives/' + this.slugifiedName + '/' + this.slugifiedName + '.html');
    }
    if (this.addAssetsFolder) {
      mkdirp('app/modules/shared/directives/' + this.slugifiedName + '/' + 'assets');
    }


    this.template('_test.js', 'app/modules/shared/directives/' + this.slugifiedName + '/' + this.slugifiedName + '-test.js');

    this.template('_directive.js', 'app/modules/shared/directives/' + this.slugifiedName + '/' + this.slugifiedName + 'Directive.js');

  }
  // updateAppFile: function() {
  // 	this.nameApp = this.config.get('appName');
  //
  // 	this.arrayModules = this.config.get('modules');
  //
  // 	this.template('_app.js','app/app.js');
  //
  // }
});

module.exports = ModuleGenerator;
