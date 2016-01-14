(function() {
    'use strict';
    var module = angular.module('core');

    module.controller('FeedbackController', function($scope, Restangular, gaToast, gaAppConfig, gaAuthentication,
                                                     gaBrowserHistory) {
        var ctrl = this;
        $scope.cfg = gaAppConfig;

        if (!$scope.cfg.has_feedback_form) {//jscs:disable requireCamelCaseOrUpperCaseIdentifiers
            gaBrowserHistory.back();
        }

        ctrl.resetForm = function() {
            $scope.feedback = {
                email : gaAuthentication.user.email || ''
            };
        };

        $scope.sendFeedback = function() {
            Restangular.all('feedback').post($scope.feedback).then(function() {
                gaToast.show('Thank you for your feedback!');
                gaBrowserHistory.back();
            });
        };

        ctrl.resetForm();
    });

}());
