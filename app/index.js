'use strict';
var util = require('util');
var generators = require('yeoman-generator');
var path = require('path');
var chalk = require('chalk');
var yosay = require('yosay');
var slugify = require("underscore.string/slugify");
var _ = require('underscore');
_.mixin(require('underscore.inflections'));
var mkdirp = require('mkdirp');

var AngmGenerator = generators.Base.extend({

	init: function () {

		this.pkg = require('../package.json');

		// Greetings to the user.
		this.log(yosay(
			'Welcome to ' + chalk.red('official Generator Angm Material') + ' generator!'
		));
	},

	askForApplicationDetails: function () {
		var done = this.async();

		var prompts = [{
			name: 'appName',
			message: 'What would you like to call your application?',
			default: 'Ang-modular'
		}, {
			name: 'appDescription',
			message: 'How would you describe your application?',
			default: 'Modular AngularJS with Angm-generator'
		}, {
			name: 'appKeywords',
			message: 'How would you describe your application in comma seperated key words?',
			default: 'AngularJS, Yeoman-Generator'
		}, {
			name: 'appAuthor',
			message: 'What is your company/author name?',
			default: 'Angmodular'
		}];

		this.prompt(prompts, function (props) {
			this.appName = props.appName;
			this.appDescription = props.appDescription;
			this.appKeywords = props.appKeywords;
			this.appAuthor = props.appAuthor;

			this.slugifiedAppName = slugify(this.appName);
			this.humanizedAppName = _.titleize(this.appName);
			this.capitalizedAppAuthor = _.camelize(this.appAuthor);

			this.config.set('appName', this.slugifiedAppName);

			done();
		}.bind(this));
	},

	askForAngularApplicationModules: function () {
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
			},{
				value: 'angularSanitize',
				name: 'ngSanitize',
				checked: true
			}]
		}];

		this.prompt(prompts, function (props) {
			this.angularCookies = _.contains(props.modules, 'angularCookies');
			this.angularAnimate = _.contains(props.modules, 'angularAnimate');
			this.angularSanitize = _.contains(props.modules, 'angularSanitize');

			this.config.set('angularCookies', this.angularCookies);
			this.config.set('angularAnimate', this.angularAnimate);
			this.config.set('angularSanitize', this.angularSanitize);

			done();
		}.bind(this));
	},

	askForUIApplicationModules: function () {
		var done = this.async();

		var prompts = [{
			type: 'checkbox',
			name: 'ui',
			message: 'Which UI Frameworkwould you like to include?',
			choices: [{
				value: 'angularBootstrap',
				name: 'Angular UI Bootstrap',
				checked: false
			},
				{
					value: 'angularMaterial',
					name: 'ngMaterial',
					checked: false
				}]
		}];

		this.prompt(prompts, function (props) {
			this.angularBootstrap = _.contains(props.ui, 'angularBootstrap');
			this.angularMaterial = _.contains(props.ui, 'angularMaterial');


			this.config.set('angularBootstrap', this.angularBootstrap);
			this.config.set('angularMaterial', this.angularMaterial);


			done();
		}.bind(this));
	},

	createApplicationScaffold: function () {
		// Create public folders
		mkdirp('app');
		mkdirp('app/modules/home');
		mkdirp('app/modules/layouts/nav-bar');
		mkdirp('app/assets/images');
		mkdirp('app/assets/fonts');
		mkdirp('app/assets/css');
		mkdirp('src/bower_components');
		mkdirp('src/plugins');
		mkdirp('app/modules/shared');

		//Copy home folder content
		this.copy('app/app.js');
		if (this.angularMaterial == true) {
			this.template('app/modules/home/home-material.html', 'app/modules/home/home.html');
		} else {
			this.copy('app/modules/home/home.html');
		}
		this.copy('app/modules/home/homeCtrl.js');
		this.copy('app/modules/home/homeRoute.js');
		this.copy('app/modules/home/homeService.js');
		this.copy('app/modules/home/homeModule.js');


		//Copy layouts folder content
		if (this.angularMaterial == true) {

			this.copy('app/modules/layouts/page/page.html');
			this.copy('app/modules/layouts/page/pageCtrl.js');

			this.copy('app/modules/layouts/side-nav/sidenav.html');
			this.copy('app/modules/layouts/side-nav/sidenavCtrl.js');
			this.copy('app/modules/layouts/side-nav/sidenavService.js');


		} else {

			this.copy('app/modules/layouts/nav-bar/navbar.html');
			this.copy('app/modules/layouts/nav-bar/navbar-tpl.html');
			this.copy('app/modules/layouts/nav-bar/navBarCtrl.js');
			this.copy('app/modules/layouts/nav-bar/navbarDirective.js');
			this.copy('app/modules/layouts/nav-bar/navbarService.js');
		}


		// Copy project files
		//this.copy('Gruntfile.js');
		this.copy('README.md');
		this.copy('LICENSE.md');
		this.copy('karma.conf.js');

		// Copy project hidden files
		this.copy('bowerrc', '.bowerrc');
		this.copy('editorconfig', '.editorconfig');
		this.copy('jshintrc', '.jshintrc');
	},

	createApplicationTemplateFiles: function () {
		this.template('_package.json', 'package.json');
		this.template('_bower.json', 'bower.json');
		if (this.angularMaterial == true) {
			this.template('_index-material.html', 'index.html');
		} else {
			this.template('_index.html', 'index.html');
		}

		this.template('app/_app.config.js', 'app/app.config.js');

		this.template('app/modules/home/_home-test.js', 'app/modules/home/home-test.js');

		this.fs.copy(
			this.templatePath('_Gruntfile.js'),
			this.destinationPath('Gruntfile.js')
		);

	},

	install: function () {

		this.installDependencies({
			skipInstall: this.options['skip-install'],
			bower: true
		});
	}

});

module.exports = AngmGenerator;
