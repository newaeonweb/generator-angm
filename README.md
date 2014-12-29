# Generator-angm [![Build Status](https://travis-ci.org/newaeonweb/generator-angm.svg?branch=master)](https://travis-ci.org/newaeonweb/generator-angm) 

Modular Yeoman Generator to scaffold modular AngularJS applications.

> [Yeoman](http://yeoman.io) Generator-angm

## Getting Started

#### Installing Yeoman
Open your terminal window and type:

```bash
npm install -g yo
```

#### Yeoman Generators

Yeoman travels light. He didn't pack any generators when he moved in. You can think of a generator like a plug-in. You get to choose what type of application you wish to create, such as a Backbone application or even a Chrome extension.

To install generator-angm from npm, run:

```bash
npm install -g generator-angm
```

Finally, initiate the generator:

```bash
yo angm
```

## Running
Open your terminal window and type:

```bash
grunt dev
```

After the command your application should start right in your default browser at `localhost:8000`.
The `Gruntfile.js` already have some tasks like: Concat, Uglify, Injector and others.

## SubGenerators
Generator-angm have a subgenerator to create your application modules

* yo angm:angm-module

After that you must entre the module name and choose what files you want.
The subgenerator will produce the following directory structure:

```
	moduleName/
		moduleName.html
		moduleNameCtrl.js
		moduleNameRoute.js
```

**Note: Subgenerators are to be run from the root directory of your app.**


#### File Content
##### View (Html Template)
File: `app/modules/moduleName/moduleName.html`.

Code:
```html
<div ng-controler="moduleName">
	
</div>
```
---
##### Controller

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
	.controller('moduleNameCtrl', ['$scope', function ($scope) {


	}]);
```
---

##### Route

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
	.config(function ($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'appName/modules/moduleName/moduleName.html',
				controller: 'moduleNameCtrl'
			});
	});
```
---

##### Injector
By default, new scripts are added to the `index.html` file. Using Grunt-injector, but only on setup configuration, after that you must run `grunt injector` or `grunt dev` every time you add a new module or script.


## Bower Components

The following packages are always installed by the angm-generator:

* "json3"
* "es5-shim"
* "bootstrap"
* "angular"
* "angular-resource"
* "angular-bootstrap"
* "angular-route


The following modules are optional on first install:

* "angular-cookies"
* "angular-animate"
* "angular-touch"
* "angular-sanitize"

All of these can be updated with `bower update` as new versions of AngularJS are released.

## Testing

Coming soon.

## Contribute

To submitting an issue, please check if pass on travis.

To submitting a bugfix, write a test that exposes the bug and fails before applying your fix.

To submitting a new feature, add tests that cover the feature.


## License

MIT
