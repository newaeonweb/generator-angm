(function() {
    'use strict';
    var module = angular.module('users');

    module.controller('ResetController', function($scope, Restangular, gaAuthentication, $stateParams, gaToast,
                                                  $state, gaTracking) {

        if (gaAuthentication.isLogged()) {
            $state.go('home');
        }

        $scope.credentials = {
            token : $stateParams.token
        };

        $scope.resetPassword = function() {
            Restangular.all('auth/reset').post($scope.credentials).then(function(user) {
                gaAuthentication.user = gaAuthentication.setUser(user);
                gaToast.show('Your password has been successfully updated, you are now logged in');
                gaTracking.eventTrack('Password reset', $scope.credentials.email);
                $state.go('home');
            });
        };
    });

}());
