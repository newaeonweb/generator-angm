'use strict';

(function() {

	/**
	* @ngdoc function
	* @name app.controller:HomeCtrl
	* @description
	* # HomeCtrl
	* Controller of the app
	*/
	angular
	.module('lab-mendelics')
	.controller('NavBarCtrl', NavBar);

	NavBar.$inject = ['homeService', 'MenuService'];

	/*
	* recommend
	* Using function declarations
	* and bindable members up top.
	*/

	function NavBar(homeService, MenuService) {
		/*jshint validthis: true */
		var vm = this;
		vm.title = "<%= slugifiedAppName %>";

		vm.menu = MenuService.listMenu();

	}

})();
