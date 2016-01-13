(function () {
	'use strict';

	/**
	 * @ngdoc function
	 * @name app.test:homeTest
	 * @description
	 * # homeTest
	 * Test of the app
	 */

	describe('homeCtrl', function () {
		var controller = null, $scope = null, $location;

		beforeEach(function () {
			module('<%= slugifiedAppName %>');
		});

		beforeEach(inject(function ($controller, $rootScope, _$location_) {
			$scope = $rootScope.$new();
			$location = _$location_;

			controller = $controller('HomeCtrl', {
				$scope: $scope
			});
		}));

		it('Should HomeCtrl must be defined', function () {
			expect(controller).toBeDefined();
		});

		it('Should match the path Module name', function () {
			$location.path('/home');
			expect($location.path()).toBe('/home');
		});

	});
})();


