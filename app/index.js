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

		this.prompt(prompts, function (props) {
			this.angularCookies = _.contains(props.modules, 'angularCookies');
			this.angularAnimate = _.contains(props.modules, 'angularAnimate');
			this.angularTouch = _.contains(props.modules, 'angularTouch');
			this.angularSanitize = _.contains(props.modules, 'angularSanitize');

			this.config.set('angularCookies', this.angularCookies);
			this.config.set('angularAnimate', this.angularAnimate);
			this.config.set('angularTouch', this.angularTouch);
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

	askForServerSide: function () {
		var done = this.async();

		var prompts = [{
			type: 'checkbox',
			name: 'server',
			message: 'Do you like to include server side engine?',
			choices: [{
				value: 'serverSide',
				name: 'Flask/GoogleAppEngine',
				checked: false
			}]
		}];

		this.prompt(prompts, function (props) {
			this.serverSide = _.contains(props.server, 'serverSide');

			this.config.set('serverSide', this.serverSide);


			done();
		}.bind(this));
	},

	chooseStructure: function () {
		// Setup a different structure to work with server side
		if (this.serverSide == true) {

			var pathTpl = 'server-tpl/';

			this.fs.copyTpl(
				this.templatePath(pathTpl + '_package.json'),
				this.destinationPath('package.json'),
				{
					appAuthor: this.appAuthor,
					capitalizedAppAuthor: this.capitalizedAppAuthor,
					nameApp: this.config.get('appName'),
					_: _,
					slugifiedAppName: this.slugifiedAppName

				}

			);

            console.log('1');

			this.fs.copyTpl(
				this.templatePath(pathTpl + '_bower.json'),
				this.destinationPath('bower.json'),
				{
					appAuthor: this.appAuthor,
					capitalizedAppAuthor: this.capitalizedAppAuthor,
					nameApp: this.config.get('appName'),
					_: _,
					slugifiedAppName: this.slugifiedAppName

				}
			);

            console.log('2');

            this.copy(pathTpl + 'editorconfig', '.editorconfig');
            this.copy(pathTpl + 'gitignore', '.gitignore');
            this.copy(pathTpl + 'hgignore', '.hgignore');

            console.log('3');

            this.copy(pathTpl + 'bowerrc', '.bowerrc');


            this.copy(pathTpl + 'jscsrc', '.jscsrc');
            this.copy(pathTpl + 'pylintrc', '.pylintrc');
            this.copy(pathTpl + 'jshintrc', '.jshintrc');
            this.copy(pathTpl + 'jslintrc.json', 'jslintrc.json');
            this.copy(pathTpl + 'htmlhintrc.json', 'htmlhintrc.json');

            console.log('4');

            this.copy(pathTpl + 'LICENSE', 'LICENSE');
            this.copy(pathTpl + 'README.md', 'README.md');
            //this.copy(pathTpl + 'bowerrc', 'bowerrc');
            this.copy(pathTpl + 'requirements.txt', 'requirements.txt');

            this.copy(pathTpl + 'gruntfile.js', 'gruntfile.js');
            this.copy(pathTpl + 'gulpfile.js', 'gulpfile.js');

            this.copy(pathTpl + 'run.py', 'run.py');

            console.log('5');


            // Copy config folder
            mkdirp('main');
            mkdirp('main/api');
            mkdirp('main/auth');
            mkdirp('main/control');
            mkdirp('main/model');

            // Public directory
            mkdirp('main/public');
            mkdirp('main/public/modules');

            console.log('6');

			this.fs.copyTpl(
				this.templatePath(pathTpl + 'main/public/_application.js'),
				this.destinationPath('main/public/application.js'),
				{
					appAuthor: this.appAuthor,
					capitalizedAppAuthor: this.capitalizedAppAuthor,
					nameApp: this.config.get('appName'),
					_: _,
					slugifiedAppName: this.slugifiedName

				}
			);

            console.log('7');

            this.copy(pathTpl + 'main/public/humans.txt', 'main/public/humans.txt');
            this.copy(pathTpl + 'main/public/robots.txt', 'main/public/robots.txt');

            // Jinja templates
			this.fs.copyTpl(
				this.templatePath(pathTpl + 'main/templates/_base.html'),
				this.destinationPath('main/templates/base.html'),
				{
					appAuthor: this.appAuthor,
					capitalizedAppAuthor: this.capitalizedAppAuthor,
					nameApp: this.config.get('appName'),
					_: _,
					slugifiedAppName: this.slugifiedName

				}
			);

            console.log('8');

            this.copy(pathTpl + 'main/templates/index.html', 'main/templates/index.html');
            mkdirp('main/templates/bit');

            // Files in main directory
            this.copy(pathTpl + 'main/__init__.py', 'main/__init__.py');

            this.fs.copyTpl(
				this.templatePath(pathTpl + 'main/_app.yaml'),
				this.destinationPath('main/app.yaml'),
				{
					appAuthor: this.appAuthor,
					capitalizedAppAuthor: this.capitalizedAppAuthor,
					nameApp: this.config.get('appName'),
					_: _,
					slugifiedAppName: this.slugifiedName

				}
			);

            console.log('9');

            this.copy(pathTpl + 'main/appengine_config.py', 'main/appengine_config.py');

            this.copy(pathTpl + 'main/index.yaml', 'main/index.yaml');
            this.copy(pathTpl + 'main/main.py', 'main/main.py');
            this.copy(pathTpl + 'main/config.py', 'main/config.py');
            console.log('9.9');

            this.fs.copy(
            	this.templatePath(pathTpl + 'main/task.py'),
            	this.destinationPath('main/task.py')
            );
            this.copy(pathTpl + 'main/util.py', 'main/util.py');




			//mkdirp('main');
			//mkdirp('main/api');
			//mkdirp('main/auth');
			//mkdirp('main/control');
			//mkdirp('main/lib');
			//mkdirp('main/model');
			//mkdirp('main/public');
			//mkdirp('main/templates');
            //
			//mkdirp('main/public/modules/');
			//mkdirp('main/public/modules/home');
			//mkdirp('main/public/modules/layouts');
			//mkdirp('main/public/assets/images');
			//mkdirp('main/public/assets/font');
			//mkdirp('main/public/assets/css');
			//mkdirp('main/public/lib');
            //
			////Copy home folder content
			//this.copy('app/app.js', 'main/public/app.js');
			//if (this.angularMaterial == true) {
			//	this.template('app/modules/home/home-material.html', 'main/public/modules/home/home.html');
			//} else {
			//	this.copy('app/modules/home/home.html', 'main/public/modules/home/home.html');
			//}
			//this.copy('app/modules/home/homeCtrl.js', 'main/public/modules/home/homeCtrl.js');
			//this.copy('app/modules/home/homeRoute.js', 'main/public/modules/home/homeRoute.js');
			//this.copy('app/modules/home/homeService.js', 'main/public/modules/home/homeService.js');
			//this.copy('app/modules/home/homeModule.js', 'main/public/modules/home/homeModule.js');
            //
            //
			////Copy layouts folder content
			//if (this.angularMaterial == true) {
            //
			//	this.copy('app/modules/layouts/page/page.html', 'main/public/modules/layouts/page/page.html');
			//	this.copy('app/modules/layouts/page/pageCtrl.js', 'main/public/modules/layouts/page/pageCtrl.js');
            //
			//	this.copy('app/modules/layouts/side-nav/sidenav.html', 'main/public/modules/layouts/side-nav/sidenav.html');
			//	this.copy('app/modules/layouts/side-nav/sidenavCtrl.js', 'main/public/modules/layouts/side-nav/sidenavCtrl.js');
			//	this.copy('app/modules/layouts/side-nav/sidenavService.js', 'main/public/modules/layouts/side-nav/sidenavService.js');
            //
            //
			//} else {
            //
			//	this.copy('app/modules/layouts/nav-bar/navbar.html', 'main/public/modules/layouts/nav-bar/navbar.html');
			//	this.copy('app/modules/layouts/nav-bar/navbar-tpl.html', 'main/public/modules/layouts/nav-bar/navbar-tpl.html');
			//	this.copy('app/modules/layouts/nav-bar/navBarCtrl.js', 'main/public/modules/layouts/nav-bar/navBarCtrl.js');
			//	this.copy('app/modules/layouts/nav-bar/navbarDirective.js', 'main/public/modules/layouts/nav-bar/navbarDirective.js');
			//	this.copy('app/modules/layouts/nav-bar/navbarService.js', 'main/public/modules/layouts/nav-bar/navbarService.js');
			//}
            //
            //
			//// Copy project files
			////this.copy('Gruntfile.js');
			//this.copy('README.md');
			//this.copy('LICENSE.md');
			//this.copy('karma.conf.js');
            //
			//// Copy project hidden files
			//this.copy('bowerrc', '.bowerrc');
			//this.copy('editorconfig', '.editorconfig');
			//this.copy('jshintrc', '.jshintrc');
            //
			//// Setting templates
			//this.template('_package.json', 'package.json');
			//this.template('_bower.json', 'bower.json');
			//if (this.angularMaterial == true) {
			//	this.template('_index-material.html', 'index.html');
			//} else {
			//	this.template('_index.html', 'index.html');
			//}
            //
			//this.template('app/_app.config.js', 'main/public/app.config.js');
            //
			//this.template('app/modules/home/_home-test.js', 'main/public/modules/home/home-test.js');
            //
			//this.fs.copy(
			//	this.templatePath('_Gruntfile.js'),
			//	this.destinationPath('Gruntfile.js')
			//);

		} else {

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

			// Setting templates
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

		}
	},

	install: function () {

		this.installDependencies({
			skipInstall: this.options['skip-install'],
			bower: true
		});
	}

});

module.exports = AngmGenerator;
