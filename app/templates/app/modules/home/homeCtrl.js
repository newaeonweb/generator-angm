'use strict';

/**
 * @ngdoc function
 * @name app.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the app
 */
angular.module('<%= slugifiedAppName %>')
	.controller('HomeCtrl', ['$scope', function ($scope) {
		$scope.title = "Hello, Angm-Generator!";

	}]);
