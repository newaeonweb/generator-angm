(function() {
	'use strict';

	/**
	 * @ngdoc function
	 * @name app.service:menuService
	 * @description
	 * # menuService
	 * Service of the app
	 */

  	angular
		.module('<%= nameApp %>')
		.factory('MenuService', Menu);
		// Inject your dependencies as .$inject = ['$http', 'someSevide'];
		// function Name ($http, someSevide) {...}

		Menu.$inject = ['$http'];

		function Menu ($http) {

			var menu = [
				<% _.each(arrayMenu, function(menu) { %>
					{
						link: '<%= menu.link %>',
							name: '<%= menu.title %>'
					},
			    <% }); %>
		  	];

			return {
				listMenu: function () {
					return menu;
				}
		  	}

		}

})();
