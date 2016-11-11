'use strict';

	/**
	* @ngdoc function
	* @name app.route:HomeRoute
	* @description
	* # HomeRoute
	* Route of the app
	*/

angular.module('lab')
	.config(['$stateProvider', function ($stateProvider) {
		$stateProvider

			.state('app', {
				url: '',
				abstract: true,
				templateUrl: 'app/modules/layouts/main-page/main-page.html',
				controller: 'LayoutCtrl',
				controllerAs: 'vm'
			});

	}]);
