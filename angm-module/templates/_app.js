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
angular.module('<%= module.name %>', []);
<% }); %>

angular.module('<%= nameApp %>', [
    'ngResource',
    'ui.bootstrap',
    <% if (angularCookies) { %>'ngCookies',
    <% } if (angularAnimate) { %>'ngAnimate',
    <% } if (angularTouch) { %>'ngTouch',
    <% } if (angularSanitize) { %>'ngSanitize',
    <% } %>'ngRoute',<% _.each(arrayModules, function(module) { %>
    '<%= module.name %>',<% }); %>
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
