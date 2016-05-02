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
		'ngMessages',<% } %>
		<% if (angularCookies) { %>'ngCookies',
		<% } if (angularAnimate) { %>'ngAnimate',
		<% } if (angularBootstrap) { %>'ngTouch',
		<% } if (angularSanitize) { %>'ngSanitize',
		<% } %>'ui.router',
		'home',
	]);

})();
