'use strict';

/**
 * @ngdoc function
 * @name app.controller:<%= slugifiedName %>Directive
 * @description
 * # <%= slugifiedName %>Directive
 * Directive of the app
 */
angular.module('<%= nameApp %>')
	.directive('<%= slugifiedNameCamelize %>', [function () {
		return {
			restrict: 'EA',
			link: function (scope, element, attrs) {
				// write your code here
			},
			controller: '<% if (addControllerFile) { %><%= slugifiedNameCapitalize %>Ctrl<% } %>',
			<% if (addTemplateFile) { %>
			templateUrl:'<%= slugifiedName %>.html',
			<% } else { %>
			template: ''
			<% } %>
		};
	}]);
