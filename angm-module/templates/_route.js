'use strict';

/**
 * @ngdoc function
 * @name app.route:<%= slugifiedName %>Route
 * @description
 * # <%= slugifiedName %>Route
 * Route of the app
 */

angular.module('<%= slugifiedName %>')
	.config(['$stateProvider', function ($stateProvider) {
		$stateProvider
			.state('<%= slugifiedName %>', {
				url:'/<%= slugifiedName %>',
				templateUrl: 'app/modules/<%= slugifiedName %>/<%= slugifiedName %>.html',
				controller: '<%= slugifiedNameCapitalize %>Ctrl'
			});
	}]);
