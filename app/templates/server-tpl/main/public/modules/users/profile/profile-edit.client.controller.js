(function() {
    'use strict';
    var module = angular.module('users');

    module.controller('ProfileEditController', function($scope, gaBrowserHistory, gaToast, _, gaValidators, gaTracking) {

        if (!$scope.hasAuthorization()) {
            gaBrowserHistory.back();
        }

        $scope.validators = gaValidators.user;

        $scope.$watch('user', function(newVal) {
            if (newVal) {
                $scope.editedUser = $scope.user.clone();
            }
        });

        $scope.save = function() {
            $scope.editedUser.save().then(function() {
                _.extend($scope.user, $scope.editedUser);
                gaTracking.eventTrack('Profile edit', $scope.editedUser.username);
                gaBrowserHistory.back();
                gaToast.show('A profile was successfully updated');
            });
        };
    });
}());
