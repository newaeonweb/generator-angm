'use strict';

/**
 * @ngdoc index
 * @name app
 * @description
 * # app
 *
 * Main modules of the application.
 */

angular.module('<%= nameApp %>', [
    'ngResource',
    'ngAria',
    'ui.bootstrap',
    <% if (angularCookies) { %>'ngCookies',
    <% } if (angularAnimate) { %>'ngAnimate',
    <% } if (angularTouch) { %>'ngTouch',
    <% } if (angularSanitize) { %>'ngSanitize',
    <% } %>'ui.router',
    'home',<% _.each(arrayModules, function(module) { %>
    '<%= module.name %>',<% }); %>
])

.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

    $locationProvider.hashPrefix('!');

    // This is required for Browser Sync to work poperly
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

    $urlRouterProvider
        .otherwise('/');

}])

.run(['$rootScope', function ($rootScope) {

    'use strict';

    console.log('AngularJS run() function...');

}]);
