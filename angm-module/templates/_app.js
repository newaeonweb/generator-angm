'use strict';

/**
 * @ngdoc index
 * @name app
 * @description
 * # app
 *
 * Main modules of the application.
 */
<% _.each(arrayModules, function(module) { %>
angular.module('<%= module.name %>',[]);
<% }); %>

var app = angular.module('<%= nameApp %>', [
    'ngResource',
    <% if (angularCookies) { %>'ngCookies', 
    <% } if (angularAnimate) { %>'ngAnimate', 
    <% } if (angularTouch) { %>'ngTouch', 
    <% } if (angularSanitize) { %>'ngSanitize', 
    <% } %>'ngRoute',<% _.each(arrayModules, function(module) { %>
    '<%= module.name %>',<% }); %>
]);

app.config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {

    $locationProvider.hashPrefix('!');

    // This is required for Browser Sync to work poperly
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

    $routeProvider
        .otherwise({
            redirectTo: '/'
        });
        
}]);

app.run(['$rootScope', function ($rootScope) {
    
    'use strict';

    console.log('Angular.js run() function...');

}]);
