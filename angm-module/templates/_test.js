'use strict';

(function () {
	describe('<%= slugifiedName %> test', function () {
		var controller = null, $scope = null;
	
		beforeEach(function () {
			module('<%= nameApp %>');
		});
		
		beforeEach(inject(function ($controller, $rootScope) {
			$scope = $rootScope.$new();
			controller = $controller('<%= slugifiedNameCapitalize %>Ctrl', {
				$scope: $scope
			});
		}));
		
		it('Should controller must be defined', function () {
			expect(controller).toBeDefined();
		});

	});
})();
