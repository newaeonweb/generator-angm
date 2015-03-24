'use strict';

/**
 * @ngdoc index
 * @name app
 * @description
 * # app
 *
 * Main module of the application.
 */
angular.module('<%= slugifiedAppName %>', [
    'ngResource',
    'ui.bootstrap',
    <% if (angularCookies) { %>'ngCookies',
    <% } if (angularAnimate) { %>'ngAnimate',
    <% } if (angularTouch) { %>'ngTouch',
    <% } if (angularSanitize) { %>'ngSanitize',
    <% } %>'ngRoute'
])

.config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {

    $locationProvider.hashPrefix('!');

    // This is required for Browser Sync to work poperly
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

    $routeProvider
        .otherwise({
            redirectTo: '/'
        });
        
}])

.run(['$rootScope', function ($rootScope) {
    
    'use strict';

    console.log('AngularJS run() function...');

}]);
