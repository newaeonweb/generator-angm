'use strict';

(function() {
	describe('homeCtrl', function () {
    	var controller = null, $scope = null;
    
	    beforeEach(function () {
	        module('<%= slugifiedAppName %>');
	    });
	    
	    beforeEach(inject(function ($controller, $rootScope) {
	        $scope = $rootScope.$new();
	        controller = $controller('HomeCtrl', {
	            $scope: $scope
	        });
	    }));
	    
	    it('Should HomeCtrl must be defined', function () {
	        expect(controller).toBeDefined();
	    });

	    it('Should have title', function() {
	    	expect($scope.title).toBe('Hello, Angm-Generator!');

	    });

	});
})();


