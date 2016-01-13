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
angular.module('<%= slugifiedAppName %>', [
    'ngResource',
    'ngAria',
    <% if (angularBootstrap) { %> 'ui.bootstrap',
    <% } if (angularMaterial) { %> 'ngMaterial',
    'ngMdIcons',
    <% } %>
    <% if (angularCookies) { %>'ngCookies',
    <% } if (angularAnimate) { %>'ngAnimate',
    <% } if (angularTouch) { %>'ngTouch',
    <% } if (angularSanitize) { %>'ngSanitize',
    <% } %>'ui.router',
    'home',
]);

})();
