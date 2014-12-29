'use strict';
var util = require('util'),
	inflections = require('underscore.inflections'),
	chalk = require('chalk'),
	yeoman = require('yeoman-generator');


var ModuleGenerator = yeoman.generators.NamedBase.extend({
	init: function() {
		this.slugifiedName = this._.slugify(this._.humanize(this.name));
		
		// Get app name from config.
		this.nameApp = this.config.get('appName');

		// Get app options from config
		this.angularCookies = this.config.get('angularCookies');
		this.angularAnimate = this.config.get('angularAnimate');
		this.angularTouch = this.config.get('angularTouch');
		this.angularSanitize = this.config.get('angularSanitize');

		this.modules = this.config.get('modules');



		for (var i = 0; i < this.modules.length; i++) {
			console.log(this.modules[i].name);
			
			if (this.modules[i].name == this.slugifiedName) {

				return this.log.writeln(chalk.red(' name already exists'));
			
			} else {

				this.modules.push({name:this.slugifiedName});

				this.config.set('modules', this.modules);
			}
		};

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
		
	},

	updateAppFile: function() {
		this.nameApp = this.config.get('appName');

			// var modules = this.config.get('modules');

			// if (!modules) {
			// 	modules = [];
			// }

			// modules.push({name:this.slugifiedName});

			// var m = this.config.get('modules');

			// for (var i = 0; i < m.length; i++) {
			// 	console.log(m[i].name);
				
			// 	if (m[i].name == this.slugifiedName) {
			// 		console.log('igual');

			// 		return this.log.writeln(chalk.red(' name already exists'));
				
			// 	} else {

			// 		this.config.set('modules', modules);
			// 	}
			// };

			

		this.template('_app.js','app/app.js');
		
		
	}
});

module.exports = ModuleGenerator;
