(function() {
    'use strict';
    var module = angular.module('users');

    /**
     * @name gaAuthOptions
     * @memberOf angularModule.users
     * @description
     * Inserts buttons for authentication via social networks
     * Auth services, for which no public key is stored in datastore, are not inserted
     * Also inserts 'remember me' checkbox, which can be binded by remember="myModel"
     */

    module.directive('gaAuthOptions', function(gaAppConfig) {
        var link = function(scope) {
            scope.authOptions = _.keys(_.pick(gaAppConfig, function(cfg, cfgName) {
                return _.startsWith(cfgName, 'auth_') && cfg;
            }));
            scope.authOptions = _.map(scope.authOptions, function(optName) {
                return optName.replace('auth_', '').replace('_id', '');
            });
            scope.authOptions.unshift('google');
            scope.remember = true;
        };

        return {
            link        : link,
            restrict    : 'EA',
            scope       : {
                remember : '='
            },
            templateUrl : '/p/modules/users/directives/gaAuthOptions.client.dir.html'
        };

    });

}());
