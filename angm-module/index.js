'use strict';
var util = require('util'),
	inflections = require('underscore.inflections'),
	yeoman = require('yeoman-generator');


var ModuleGenerator = yeoman.generators.NamedBase.extend({
	init: function() {
		this.slugifiedName = this._.slugify(this._.humanize(this.name));
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
		var ap = this.config.get('appName');

		console.log(ap);
	}
});

module.exports = ModuleGenerator;
