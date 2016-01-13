'use strict';

(function() {

	/**
	* @ngdoc function
	* @name app.service:menuService
	* @description
	* # menuService
	* Service of the app
	*/
	angular
	.module('<%= slugifiedAppName %>')
	.factory('MenuService', Menu);
	// Inject your dependencies as .$inject = ['$http', 'someSevide'];
	// function Name ($http, someSevide) {...}

	Menu.$inject = ['$http'];

	function Menu ($http) {
    // Sample code.

		var menu = [{
            link : '.',
            name: 'This is a Placeholder menu. It disappears when the first module has been created.'
        }];

		return {
			listMenu: function () {
				return menu;
			}
		}

	}

})();
