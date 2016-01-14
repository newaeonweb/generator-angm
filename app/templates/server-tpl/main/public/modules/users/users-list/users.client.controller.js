(function() {
    'use strict';
    var module = angular.module('admin');

    module.controller('UsersController', function($scope, Restangular) {

        var ctrl = this;
        var nextCursor = '';
        var more = true;
        $scope.users = [];

        ctrl.getUsers = function() {
            if (!more) {
                return;
            }
            $scope.isLoading = true;
            Restangular.all('users').getList({cursor: nextCursor, filter: $scope.filter}).then(function(users) {
                $scope.users = $scope.users.concat(users);
                nextCursor = users.meta.nextCursor;
                more = users.meta.more;
                $scope.totalCount = users.meta.totalCount;
            }).finally(function() {
                $scope.isLoading = false;
            });
        };

        ctrl.getUsers();

        // This is fired when user scrolled to bottom
        $scope.$on('mainContentScrolled', function() {
            ctrl.getUsers();
        });

    });
}());
