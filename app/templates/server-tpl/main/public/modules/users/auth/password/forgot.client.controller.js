(function() {
    'use strict';
    var module = angular.module('users');

    module.controller('ForgotController', function($scope, Restangular, gaToast, gaBrowserHistory, gaTracking) {

        $scope.askForNewPassword = function() {
            Restangular.all('auth/forgot').post($scope.credentials).then(function() {
                gaToast.show('Your password has been reset. Please check your email');
                gaTracking.eventTrack('Forgot password', $scope.credentials.email);
                gaBrowserHistory.back();
            });
        };
    });

}());
