'use strict';

(function() {

	/**
	* @ngdoc function
	* @name app.controller:<%= slugifiedName %>Directive
	* @description
	* # <%= slugifiedName %>Directive
	* Directive of the app
	*/
angular
		.module('<%= nameApp %>')
		.directive('<%= slugifiedNameCamelize %>', <%= slugifiedNameCamelize %>);

		function <%= slugifiedNameCamelize %> () {

			var directive = {
				link: link,
				restrict: 'EA',
				controller: '<% if (addControllerFile) { %><%= slugifiedNameCapitalize %>Ctrl<% } %>',
				<% if (addTemplateFile) { %>
				templateUrl:'app/modules/shared/directives/<%= slugifiedName %>/<%= slugifiedName %>.html',
				<% } else { %>
				template: ''
				<% } %>
			}

			return directive;

			function link(scope, element, attrs) {
				// write your code here
			}

		}

})();
