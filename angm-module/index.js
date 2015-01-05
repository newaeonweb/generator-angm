'use strict';
var util = require('util'),
	inflections = require('underscore.inflections'),
	chalk = require('chalk'),
	yeoman = require('yeoman-generator');


var ModuleGenerator = yeoman.generators.Base.extend({
	init: function() {
		this.slugifiedName = this._.slugify(this._.humanize(this.name));
		
		// Get app name from config.
		this.nameApp = this.config.get('appName');

		// Get app options from config
		this.angularCookies = this.config.get('angularCookies');
		this.angularAnimate = this.config.get('angularAnimate');
		this.angularTouch = this.config.get('angularTouch');
		this.angularSanitize = this.config.get('angularSanitize');

	},

	askForModuleNames: function() {
		var done = this.async();

		var prompts = [{
			name:'moduleName',
            message:'What would you like to call the module ?',
            default: 'module name must be here'
		}];

		this.prompt(prompts, function(props) {
			this.moduleName = props.moduleName;

			this.slugifiedName = this._.slugify(this.moduleName);

			this.slugifiedNameCapitalize = this._.capitalize(this.moduleName);

			this.modules = this.config.get('modules');

			if (!this.modules) {
        		this.modules = [];
    		}

			for (var i = 0; i < this.modules.length; i++) {

				this.listModules = this.modules[i].name

				console.log(this.listModules);

				if (this.slugifiedName === this.listModules ) {

					return this.log.writeln(chalk.red(' Module name already exists'));
				
				}
			};

			this.modules.push({name:this.slugifiedName});

			this.config.set('modules', this.modules);


			done();
		}.bind(this));
	},

	askForModuleFolders: function() {
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
			}]
		}];

		this.prompt(prompts, function(props) {
			this.addControllerFile = this._.contains(props.folders, 'addControllerFile');
			this.addRouteFile = this._.contains(props.folders, 'addRouteFile');
			this.addTplFile = this._.contains(props.folders, 'addTplFile');

			done();
		}.bind(this));
	},

	renderModule: function() {
		// Create module folder
		this.mkdir('app/modules/' + this.slugifiedName);

		// Render angular module definition
		if (this.addControllerFile) this.template('_controller.js', 'app/modules/' + this.slugifiedName + '/' + this.slugifiedName + 'Ctrl.js');
		if (this.addRouteFile) this.template('_route.js', 'app/modules/' + this.slugifiedName + '/' + this.slugifiedName + 'Route.js');
		if (this.addTplFile) this.template('_template.html', 'app/modules/' + this.slugifiedName + '/' + this.slugifiedName + '.html');

		this.template('_test.js', 'app/modules/' + this.slugifiedName + '/' + this.slugifiedName + '-test.js');		
		
	},

	updateAppFile: function() {
		this.nameApp = this.config.get('appName');

		this.arrayModules = this.config.get('modules');	

		this.template('_app.js','app/app.js');
				
	}
});

module.exports = ModuleGenerator;
