/**
 * @namespace angularModule
 */

// Init the application configuration module for AngularJS application
var AppConfig = (function() {
    'use strict';
    // Init module configuration options
    var applicationModuleName = '<%= nameApp %>';
    var applicationModuleVendorDependencies = [
        'ngAnimate',
        'ngMessages',
        'restangular',
        'ui.router',
        'noCAPTCHA',
        'ngMaterial',
        'lrInfiniteScroll',
        'angulartics',
        'angulartics.google.analytics'
    ];

    // Add a new vertical module
    var registerModule = function(moduleName, dependencies) {
        // Create angular module
        angular.module(moduleName, dependencies || []);

        // Add the module to the AngularJS configuration file
        angular.module(applicationModuleName).requires.push(moduleName);
    };

    return {
        applicationModuleName               : applicationModuleName,
        applicationModuleVendorDependencies : applicationModuleVendorDependencies,
        registerModule                      : registerModule
    };
}());

//Start by defining the main module and adding the module dependencies
angular.module(AppConfig.applicationModuleName, AppConfig.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(AppConfig.applicationModuleName).config([
    '$locationProvider',
    function($locationProvider) {
        'use strict';
        $locationProvider.hashPrefix('!');
    }
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
    'use strict';
    //Fixing facebook bug with redirect
    if (window.location.hash === '#_=_') {
        window.location.hash = '#!';
    }

    //Then init the app
    angular.bootstrap(document, [AppConfig.applicationModuleName]);
});
