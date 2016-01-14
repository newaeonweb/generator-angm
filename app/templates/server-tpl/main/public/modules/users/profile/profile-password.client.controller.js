(function() {
    'use strict';
    var module = angular.module('users');

    module.controller('ProfilePasswordController', function($scope, gaToast, $state, gaBrowserHistory, gaTracking) {
        if (!$scope.hasAuthorization()) {
            gaBrowserHistory.back();
        }

        $scope.save = function() {
            $scope.user.post('password', $scope.credentials).then(function() {
                gaTracking.eventTrack('Password change', $scope.user.username);
                gaToast.show('Your password was successfully changed');
                $state.go('profile.view', {username : $scope.user.username});
            });
        };
    });
}());
