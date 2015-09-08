'use strict';

/**
 * @ngdoc function
 * @name app.controller:<%= slugifiedName %>Ctrl
 * @description
 * # <%= slugifiedName %>Ctrl
 * Controller of the app
 */
 angular.module('<%= nameApp %>')
  .directive('<%= slugifiedNameCamelize %>')
	  .controller('<%= slugifiedNameCapitalize %>Ctrl', <%= slugifiedNameCapitalize %> );

    function <%= slugifiedNameCapitalize %>() {
      
    }
