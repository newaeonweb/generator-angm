'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var path = require('path');
var chalk = require('chalk');
var yosay = require('yosay');

var AngmGenerator = yeoman.generators.Base.extend({

	init: function() {
		// read the local package file
		this.pkg = yeoman.file.readJSON(path.join(__dirname, '../package.json'));

		// invoke npm install on finish
		this.on('end', function(callback) {
			//if (!this.options['skip-install']) {
				
				this.installDependencies({
					bower: true,
					npm: true,
					skipInstall: false,
 					callback: function () {
 						console.log('Everything is ready!');
	      			}
 				});
			//}
		});

		// have Yeoman greet the user
		console.log(this.yeoman);

		// replace it with a short and sweet description of your generator
		console.log(chalk.magenta('You\'re using the official Angmodular generator.'));
	},

	askForApplicationDetails: function() {
		var done = this.async();

		var prompts = [{
			name: 'appName',
			message: 'What would you like to call your application?',
			default: 'Angmodular'
		}, {
			name: 'appDescription',
			message: 'How would you describe your application?',
			default: 'Modular AngularJS with Angmodular generator'
		}, {
			name: 'appKeywords',
			message: 'How would you describe your application in comma seperated key words?',
			default: 'AngularJS, Yeoman-Generator'
		}, {
			name: 'appAuthor',
			message: 'What is your company/author name?'
		}];

		this.prompt(prompts, function(props) {
	  	this.appName = props.appName;
	  	this.appDescription = props.appDescription;
	  	this.appKeywords = props.appKeywords;
	  	this.appAuthor = props.appAuthor;

	  	this.slugifiedAppName = this._.slugify(this.appName);
	  	this.humanizedAppName = this._.humanize(this.appName);
	  	this.capitalizedAppAuthor = this._.capitalize(this.appAuthor);

	  	done();
		}.bind(this));
	},

	askForAngularApplicationModules: function() {
		var done = this.async();

		var prompts = [{
			type: 'checkbox',
			name: 'modules',
			message: 'Which AngularJS modules would you like to include?',
		  	choices: [{
				value: 'angularCookies',
				name: 'ngCookies',
				checked: true
		  	}, {
				value: 'angularAnimate',
				name: 'ngAnimate',
				checked: true
		  	}, {
				value: 'angularTouch',
				name: 'ngTouch',
				checked: true
		  	}, {
				value: 'angularSanitize',
				name: 'ngSanitize',
				checked: true
		  	}]
		}];

		this.prompt(prompts, function(props) {
		this.angularCookies = this._.contains(props.modules, 'angularCookies');
		this.angularAnimate = this._.contains(props.modules, 'angularAnimate');
		this.angularTouch = this._.contains(props.modules, 'angularTouch');
		this.angularSanitize = this._.contains(props.modules, 'angularSanitize');

		done();
		}.bind(this));
  	},

	copyApplicationFolder: function() {
		// Create public folders
		this.mkdir('app');
		this.mkdir('app/home');
		this.mkdir('app/assets/images');
		this.mkdir('src/bower_components');

		//Copy home folder content
		this.copy('app/app.js');
		this.copy('app/home/home.html');
		this.copy('app/home/homeCtrl.js');
		this.copy('app/home/homeRoute.js');

		// Copy project files
		this.copy('index.html');
		this.copy('Gruntfile.js');
		this.copy('README.md');
		this.copy('LICENSE.md');

		// Copy project hidden files
		this.copy('bowerrc', '.bowerrc');
		this.copy('editorconfig', '.editorconfig');
	},

	renderApplicationDependenciesFiles: function() {
		this.template('_package.json', 'package.json');
		this.template('_bower.json', 'bower.json');
	}

});



module.exports = AngmGenerator;

