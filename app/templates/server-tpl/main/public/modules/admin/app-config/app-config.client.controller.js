(function() {
    'use strict';
    var module = angular.module('admin');

    module.controller('AdminAppConfigController', function($scope, Restangular, _, gaToast, gaAppConfig) {
        Restangular.one('config').get().then(function(cfg) {
            $scope.cfg = cfg;
        });

        $scope.isSecretKey = function(key) {
            return _.endsWith(key, '_secret');
        };

        $scope.getAuthOptions = function() {
            /*jslint unparam:true*/
            return _.pick($scope.cfg, function(prop, name) {
                return _.startsWith(name, 'auth_');
            });
        };

        $scope.getAuthName = function(str) {
            return str.replace('_id', '').replace('_secret', '').replace('auth_', '');
        };

        $scope.capitalizeAuthName = function(str) {
            str = $scope.getAuthName(str);
            return _.capitalize(str);
        };

        $scope.save = function() {
            $scope.cfg.save().then(function() {
                _.extend(gaAppConfig, $scope.cfg);
                gaToast.show('Application configuration was successfully saved.');
                $scope.appConfigForm.$setPristine();
            });
        };

    });

}());
