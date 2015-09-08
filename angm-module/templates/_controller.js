	'use strict';

	/**
	* @ngdoc function
	* @name app.controller:<%= slugifiedName %>Ctrl
	* @description
	* # <%= slugifiedName %>Ctrl
	* Controller of the app
	*/
	angular
	.module('<%= slugifiedName %>')
	.controller('<%= slugifiedNameCapitalize %>Ctrl', <%= slugifiedNameCapitalize %>);

	<%= slugifiedNameCapitalize %>.$inject = [];

	/*
	* recommend
	* Using function declarations
	* and bindable members up top.
	*/

	function <%= slugifiedNameCapitalize %>() {
		/*jshint validthis: true */
		var vm = this;

	}
