'use strict';
var util = require('util');
var chalk = require('chalk');
var generators = require('yeoman-generator');
var yosay = require('yosay');
var slugify = require("underscore.string/slugify");
var _ = require('underscore');
_.mixin(require('underscore.inflections'));
var mkdirp = require('mkdirp');


var ModuleGenerator = generators.Base.extend({
  init: function () {

    // Greetings to the user.
    this.log(yosay(
      'Ohhh ' + chalk.yellow('Let\`s create a new module') + ' now!'
    ));

    this.slugifiedName = slugify(this.name);

    // Get app name from config.
    this.nameApp = this.config.get('appName');

    // Get app options from config
    this.angularCookies = this.config.get('angularCookies');
    this.angularAnimate = this.config.get('angularAnimate');
    this.angularTouch = this.config.get('angularTouch');
    this.angularSanitize = this.config.get('angularSanitize');

  },

  askForModuleNames: function () {
    var done = this.async();

    var prompts = [{
      name: 'moduleName',
      message: 'What would you like to call the module?',
      default: 'module name must be here'
    }];

    this.prompt(prompts, function (props) {
      this.moduleName = props.moduleName;

      this.slugifiedName = slugify(this.moduleName);
      this.slugifiedNameCapitalize = _.camelize(this.slugifiedName);

      this.modules = this.config.get('modules');

      if (!this.modules) {
        this.modules = [];
      }

      for (var i = 0; i < this.modules.length; i++) {

        this.listModules = this.modules[i].name;

        console.log(this.listModules);

        if (this.slugifiedName === this.listModules) {

          return this.log.writeln(chalk.red(' Module name already exists'));

        }
      }

      this.modules.push({name: this.slugifiedName});

      this.config.set('modules', this.modules);

      done();
    }.bind(this));
  },

  askForModuleFolders: function () {
    var done = this.async();

    var prompts = [{
      type: 'checkbox',
      name: 'folders',
      message: 'Which files would you like your module to include?',
      choices: [{
        value: 'addControllerFile',
        name: 'Controller',
        checked: true
      }, {
        value: 'addRouteFile',
        name: 'Route',
        checked: true
      }, {
        value: 'addTplFile',
        name: 'View (HTML)',
        checked: true
      }, {
        value: 'addServiceFile',
        name: 'Service',
        checked: true
      }]
    }];

    this.prompt(prompts, function (props) {
      this.addControllerFile = _.contains(props.folders, 'addControllerFile');
      this.addRouteFile = _.contains(props.folders, 'addRouteFile');
      this.addTplFile = _.contains(props.folders, 'addTplFile');
      this.addServiceFile = _.contains(props.folders, 'addServiceFile');

      done();
    }.bind(this));
  },

  renderModule: function () {
    // Create module folder
    mkdirp('app/modules/' + this.slugifiedName);

    // Render angular module definition
    if (this.addControllerFile) this.template('_controller.js', 'app/modules/' + this.slugifiedName + '/' + this.slugifiedName + 'Ctrl.js');
    if (this.addRouteFile) this.template('_route.js', 'app/modules/' + this.slugifiedName + '/' + this.slugifiedName + 'Route.js');
    if (this.addServiceFile) this.template('_service.js', 'app/modules/' + this.slugifiedName + '/' + this.slugifiedName + 'Service.js');

	if (this.addTplFile) {

		var m = this.config.get('angularMaterial');

		if (m == true) {

			this.template('_template-material.html', 'app/modules/' + this.slugifiedName + '/' + this.slugifiedName + '.html');

		} else {

			this.template('_template.html', 'app/modules/' + this.slugifiedName + '/' + this.slugifiedName + '.html');
		}


	}

	this.template('_test.js', 'app/modules/' + this.slugifiedName + '/' + this.slugifiedName + '-test.js');
    this.template('_module.js', 'app/modules/' + this.slugifiedName + '/' + this.slugifiedName + 'Module.js');

    this.menu = this.config.get('menu');

      if (!this.menu) {
        this.menu = [];
      }

      for (var i = 0; i < this.menu.length; i++) {

        this.listMenu = this.menu[i].link;

        console.log(this.listMenu);

        if (this.slugifiedName === this.listMenu) {

          return this.log.writeln(chalk.red(' Menu name already exists'));

        }
      }

      this.menu.push({link: this.slugifiedName, title: this.slugifiedNameCapitalize});

      this.config.set('menu', this.menu);

      //this.template('_navService.js', 'app/modules/shared/navService.js');
  },

  updateAppFile: function () {
    // Get config user data and options and pass to template

    this.fs.copyTpl(
      this.templatePath('_app.js'),
      this.destinationPath('app/app.js'),
      {
        arrayModules: this.config.get('modules'),
        nameApp: this.config.get('appName'),
        angularCookies: this.config.get('angularCookies'),
        angularAnimate: this.config.get('angularAnimate'),
        angularTouch: this.config.get('angularTouch'),
        angularSanitize: this.angularSanitize,
        _: _,
        angularBootstrap: this.config.get('angularBootstrap'),
        angularMaterial: this.config.get('angularMaterial')

      }
    );

    var getUI = this.config.get('angularMaterial');

    if (getUI == true) {

      this.fs.copyTpl(

      this.templatePath('_navService.js'),
      this.destinationPath('app/modules/layouts/side-nav/sidenavService.js'),
      {
        arrayMenu: this.config.get('menu'),
        nameApp: this.config.get('appName'),
        _: _,
        slugifiedName: this.slugifiedName

      }
    );
    }

    this.fs.copyTpl(

      this.templatePath('_navService.js'),
      this.destinationPath('app/modules/layouts/nav-bar/navBarService.js'),
      {
        arrayMenu: this.config.get('menu'),
        nameApp: this.config.get('appName'),
        _: _,
        slugifiedName: this.slugifiedName

      }
    );

  }
});

module.exports = ModuleGenerator;
