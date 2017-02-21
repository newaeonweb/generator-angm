# Generator-angm [![Build Status](https://travis-ci.org/newaeonweb/generator-angm.svg?branch=master)](https://travis-ci.org/newaeonweb/generator-angm) [![NPM Downloads](http://img.shields.io/npm/dm/generator-angm.svg)](https://www.npmjs.org/package/generator-angm) [![npm version](https://badge.fury.io/js/generator-angm.svg)](http://badge.fury.io/js/generator-angm)

![AngularJS Modular Generator](https://raw.githubusercontent.com/newaeonweb/newaeonweb.github.io/master/assets/images/angm-logo.png)

# AngularJS Yeoman Generator to help you getting started with a new project based on AngularJS/Angular Material or Bootstrap to build large scale applications. #

> [Modular AngularJS Applications](http://www.newaeonweb.com.br/generator-angm) with Generator-angm

# Disclaimer

The main reason for creating this project and not using an existing one was to optimize the creation time of applications from scratch.

It was built using AngularJS best practices using the latest stable version (1.5.0.).

The project will not migrate to the new version of Angular (2.0) until it becomes stable. The current version is already stable and meets the needs of most web projects.

## Getting Started

#### Installing dependencies

Run:
```bash
npm install -g yo grunt-cli generator-angm bower-installer
```

#### Creating an application

From the command line, run the generator:

```bash
yo angm
```

> You'll receive prompts for your project name, author, and what UI framework to use: Bootstrap or Angular Material.

> NOTE: after using **yo angm** command, we generated the **.yo-rc.json** file to prevent the generator from being run more than once.

## Running project on development
Open your Terminal/Shell and type:

```bash
grunt dev
```

After the command your application will launch in your default browser at `localhost:4000`.

## Running project on production
Open your Terminal/Shell and type:

```bash
grunt build
```

The `Gruntfile.js` already have some tasks like: Concat, Uglify, Injector and template cache.

> NOTE: The command will concat and minify all (JS) application files and the HTML templates will be mixed in on file called `templates.js`, all these files will be injected on **index.html**.

# Built in SubGenerators

Generator-angm has subgenerators to create your application modules and directives.

1. Modules
2. Directives

## Modules
To create a module just type on your Terminal/Shell:

```
yo angm:angm-module
```

After that, you must enter the module name and choose what files you want to include.

The subgenerator will produce the following directory structure:

```
	moduleName/
		moduleName.html
		moduleNameModule.js
		moduleNameCtrl.js
		moduleNameRoute.js
		moduleNameService.js
		moduleName-test.js
```

**Note: Subgenerators are to be run from the root directory of your application.**

## Directives

To create a directive just type on your terminal window:

```
yo angm:angm-directive
```

After that you must enter the directive name and choose what dependencies you want. By default we use external templates and external controllers.

The subgenerator will produce the following directory structure:

```
shared/
		directives/
			directiveName/
				assets/ /* optional folder
				directiveName.html
				directiveNameCtrl.j
				directiveName-test.js
```

# Application files:

## View (Html Template)

File: `app/modules/moduleName/moduleName.html`.

Code:
```html
<div>
	Content from: "Page = moduleName"
</div>
```

---

## Controller

File: `app/modules/moduleName/moduleNameCtrl.js`.

Code:
```javascript
'use strict';

/**
 * @ngdoc function
 * @name appName.controller:moduleNameCtrl
 * @description
 * # moduleNameCtrl
 * Controller of the appName
 */
angular.module('appName')
	.controller('ModuleNameCtrl', ModuleNameCtrl);

	ModuleNameCtrl.$inject = ['Array of Dependencies optional'];

	function ModuleNameCtrl ('Array of Dependencies is the same above') {

	}

```

---

## Route

File: `app/modules/moduleName/moduleNameRoute.js`.

Code:
```javascript
'use strict';

/**
 * @ngdoc function
 * @name appName.route:moduleNameRoute
 * @description
 * # moduleNameRoute
 * Route of the appName
 */
angular.module('appName')
	.config(function ($stateProvider) {
		$stateProvider
			.state('moduleName', {
				url: '/moduleName',
				templateUrl: 'appName/modules/moduleName/moduleName.html',
				controller: 'moduleNameCtrl',
				controllerAs: 'vm'
			});
	});
```

---

## Module

File: `app/modules/moduleName/moduleNameModule.js`.

Code:
```javascript
'use strict';

/**
 * @ngdoc function
 * @name appName.route:moduleNameModule
 * @description
 * # moduleNameModule
 * Route of the appName
 */

 (function() {
   'use strict';

   angular.module('moduleName', []);

 })();
```

---

## App starter script

File: `app/app.js`.

Code:
```javascript
(function() {
	'use strict';

	/**
	 * @ngdoc index
	 * @name app
	 * @description
	 * # app
	 *
	 * Main module of the application.
	 */

	angular.module('Application name', [
		'ngResource',
		'ngAria',
		 'ngMaterial',
		'ngMdIcons',
		'ngCookies',
		'ngAnimate',
		'ngSanitize',
		'ui.router',
		'home',
	]);

})();

```

---

## App config script

File: `app/app-config.js`.

Code:
```javascript
(function () {
	'use strict';

	/**
	 * @ngdoc configuration file
	 * @name app.config:config
	 * @description
	 * # Config and run block
	 * Configutation of the app
	 */


	angular
		.module('ang-modular')
		.config(configure)
		.run(runBlock);

	configure.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider'];

	function configure($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

		$locationProvider.hashPrefix('!');

		// This is required for Browser Sync to work poperly
		$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';


		$urlRouterProvider
			.otherwise('/dashboard');

	}

	runBlock.$inject = ['$rootScope'];

	function runBlock($rootScope) {
		'use strict';

		console.log('AngularJS run() function...');
	}
})();
```

---

# Gruntfile tasks

By default, new scripts are added to the `index.html` file. Using Grunt-injector, but only on setup configuration, after that you must run `grunt injector` or `grunt dev` every time you add a new module, directive or script.


# Bower Components

The following packages are installed by the angm-generator:

* "json3"
* "es5-shim"
* "bootstrap"
* "angular"
* "angular-resource"
* "angular-aria"
* "angular-mocks"
* "angular-touch"
* "angular-bootstrap"
* "angular-ui-router"

> NOTE: Angular Material have the following dependencies:
* angular-material-icons
* angular-material
* angular-messages


The following modules are optional on first install:

* "angular-cookies"
* "angular-animate"
* "angular-sanitize"

All of these can be updated with `bower update` as new versions of AngularJS are released. The generator will use the most recent stable version of all libraries on first install.


# Testing

We implemented only one kind of test at this moment: Unit tests. Future versions will implement e2e tests.

## Running Tests

The tests are written in **Jasmine**, which we run with the [Karma Test Runner][karma]. We provide a Karma configuration file pre-configured with some default options to run them.

* the configuration is found at `karma.conf.js`
* the unit tests are found on each module created named as `moduleName-test.js`.

The easiest way to run the unit tests is to use the supplied npm script on `package.json` file:

```
npm test
```

This script will start the Karma test runner to execute the unit tests.


# Contribute

To submit an issue, please verify it passes its build on travis.
To submit a bugfix, write a test that exposes the bug and fails before applying your fix.
To submit a new feature, add tests that cover the feature.


## License

MIT
