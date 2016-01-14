(function() {
    'use strict';
    var module = angular.module('core');

    module.controller('SidenavController', function($scope, $mdSidenav, gaAuthentication, gaAppConfig, Restangular,
                                                    gaToast, $timeout) {
        $scope.auth = gaAuthentication;
        $scope.cfg = gaAppConfig;
        $scope.closeSidenav = function() {
            $mdSidenav('leftSidenav').close();
        };

        $scope.generateDatabase = function() {
            gaToast.show('Generating database...', {delay : 0});
            Restangular.all('generate_database').post().then(function() {
                gaToast.update('Database was successfully generated. You can sign in with admin:123456');
                $timeout(gaToast.hide, 5000);
            });
        };

        $scope.$on('$stateChangeSuccess', $scope.closeSidenav);
    });
}());
