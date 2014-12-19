'use strict';

/**
 * @ngdoc function
 * @name app.route:<%= slugifiedName %>Route
 * @description
 * # <%= slugifiedName %>Route
 * Route of the app
 */

angular.module('<%= slugifiedName %>')
	.config(function ($routeProvider) {
		$routeProvider
			.when('/<%= slugifiedName %>', {
				templateUrl: 'app/modules/<%= slugifiedName %>/<%= slugifiedName %>.html',
				controller: '<%= slugifiedName %>Ctrl'
			});
	});