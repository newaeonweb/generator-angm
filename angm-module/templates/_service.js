'use strict';

(function() {

	/**
	* @ngdoc function
	* @name app.service:<%= slugifiedName %>Service
	* @description
	* # <%= slugifiedName %>Service
	* Service of the app
	*/
angular
		.module('<%= slugifiedName %>')
		.factory('<%= slugifiedNameCapitalize %>Service', <%= slugifiedNameCapitalize %>);
		// Inject your dependencies as .$inject = ['$http', 'someSevide'];
		// function Name ($http, someSevide) {...}

		<%= slugifiedNameCapitalize %>.$inject = ['$http'];

		function <%= slugifiedNameCapitalize %> ($http) {

		}

})();
