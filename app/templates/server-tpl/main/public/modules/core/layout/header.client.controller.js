(function() {
    'use strict';
    var module = angular.module('core');

    module.controller('HeaderController', function($scope, gaAppConfig, gaAuthentication, $mdSidenav) {
        $scope.cfg = gaAppConfig;
        $scope.auth = gaAuthentication;
        $scope.user = gaAuthentication.user;

        $scope.toggleSidenav = function() {
            $mdSidenav('leftSidenav').toggle();
        };
    });

}());
